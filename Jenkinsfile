pipeline {
    agent any
    environment {
        RSYNC_SSH = credentials('NETRSYNCSSH')
        SSH_CONNECTION = credentials('NETSSHCONNECTION')
        EXCLUDES = "--exclude Jenkinsfile --exclude /source/images/*/*.png --exclude README.md --exclude LICENSE"
    }
    parameters {
        choice(name: 'DEPLOYLOCATION', choices: ['test', 'prod'], description: 'Whether to deploy to test or production location')
    }
    stages {
        stage("Prepare") {
            steps {
                // clean ws and clone repo
                cleanWs()
                git poll: false,
                    url: 'https://github.com/egartley/net.git'
            }
        }
        stage("Build") {
            steps {
                // replace all "/png" and ".png" with "/webp" and ".webp"
                script {
                    def matches = ["*.erb", "*.css", "*.js"]
                    for (int i = 0; i < matches.size(); ++i) {
                        def resloc = "s/\\/images\\//https:\\/\\/egartley.net\\/images\\//g"
                        if (params.DEPLOYLOCATION == "test") {
                            resloc = "s/\\/images\\//https:\\/\\/test.egartley.net\\/images\\//g"
                        }
                        sh "find . -type f -name '${matches[i]}' -print0 | xargs -0 sed -i '${resloc}'"
                        sh "find . -type f -name '${matches[i]}' -print0 | xargs -0 sed -i 's/\\/png/\\/webp/g'"
                        sh "find . -type f -name '${matches[i]}' -print0 | xargs -0 sed -i 's/.png/.webp/g'"
                    }
                }
                script {
                    def fullcommand = ""
                    def files = findFiles(glob: 'source/images/**')
                    files.each { f ->
                        def newpath = f.path.replace(".png", ".webp")
                        if (!f.directory && f.path.endsWith(".png")) {
                            fullcommand = fullcommand + "~/webp/bin/cwebp -quiet -q 90 ${f.path} -o ${newpath} ; "
                            fullcommand = fullcommand + "rm ${f.path} ; "
                        }
                    }
                    sh fullcommand.substring(0, fullcommand.length() - 3)
                }
                sh """bundle install
                bundle exec middleman build"""
            }
        }
        stage("Deploy") {
            steps {
                // upload build directory to server with ssh
                script {
                    deploypath = "public_html"
                    if (params.DEPLOYLOCATION == "test") {
                        deploypath += "/test"
                    }
                }
                sh "rsync -rP -e \"${RSYNC_SSH}\" ${EXCLUDES} build/ ${SSH_CONNECTION}:${deploypath}"
            }
        }
    }
}
