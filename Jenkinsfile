pipeline {
    agent any
    environment {
        RSYNC_SSH = credentials('NETRSYNCSSH')
        SSH_CONNECTION = credentials('NETSSHCONNECTION')
        EXCLUDES = "--exclude Jenkinsfile --exclude /resources/json/aXoUztUmqZpBb8pz --exclude /resources/png"
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
                // replace all "/resources/" with "https://resources.egartley.net/"
                // then replace all "/png" and ".png" with "/webp" and ".webp"
                script {
                    def matches = ["*.html", "*.css", "*.js"]
                    for (int i = 0; i < matches.size(); ++i) {
                        def resloc = "s/\\/resources\\//https:\\/\\/resources.egartley.net\\//g"
                        if (params.DEPLOYLOCATION == "test") {
                            resloc = "s/\\/resources\\//https:\\/\\/test.egartley.net\\/resources\\//g"
                        }
                        sh "find . -type f -name '${matches[i]}' -print0 | xargs -0 sed -i '${resloc}'"
                        sh "find . -type f -name '${matches[i]}' -print0 | xargs -0 sed -i 's/\\/png/\\/webp/g'"
                        sh "find . -type f -name '${matches[i]}' -print0 | xargs -0 sed -i 's/.png/.webp/g'"
                    }
                }
                sh "mkdir resources/webp"
                script {
                    // mirror subdirectories of png into webp
                    def subdirs = sh(returnStdout: true, script: 'ls -d resources/png/*').trim().split("\n")
                    subdirs.each { sf ->
                        def newpath = sf.replace("/png", "/webp")
                        sh "mkdir ${newpath}"
                    }
                    // create all webps
                    def fullcommand = ""
                    def files = findFiles(glob: 'resources/png/**')
                    files.each { f ->
                        def newpath = f.path.replace("/png", "/webp")
                        newpath = newpath.replace(".png", ".webp")
                        if (!f.directory) {
                            fullcommand = fullcommand + "~/webp/bin/cwebp -quiet -q 90 ${f.path} -o ${newpath} ; "
                        }
                    }
                    // run all webp commands in one sh call to reduce build time
                    sh fullcommand.substring(0, fullcommand.length() - 3)
                }
                sh """bundle install
                bundle exec jekyll build"""
            }
        }
        stage("Deploy") {
            steps {
                // upload _site directory to server with ssh
                script {
                    deploypath = "public_html"
                    if (params.DEPLOYLOCATION == "test") {
                        deploypath += "/test"
                    }
                }
                sh "sudo rsync -rP -e \"${RSYNC_SSH}\" ${EXCLUDES} _site/ ${SSH_CONNECTION}:${deploypath}"
            }
        }
    }
}
