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
                // replace all "/resources" with "https://resources.egartley.net"
                script {
                    def matches = ["*.html", "*.css", "*.js"]
                    for (int i = 0; i < matches.size(); ++i) {
                        sh "find . -type f -name \"${matches[i]}\" -print0 | xargs -0 sed -i 's/\\/resources\\//https:\\/\\/resources.egartley.net\\//g'"
                    }
                }
                // remove all existing webps
                sh "rm -r resources/webp"
                sh "mkdir resources/webp"
                // compress pngs into webp
                script {
                    // mirror subdirectories of png into webp
                    def subdirs = sh(returnStdout: true, script: 'ls -d resources/png/*').trim().split("\n")
                    subdirs.each { sf ->
                        def newpath = sf.replace("/png", "/webp")
                        sh "mkdir ${newpath}"
                    }
                    // create all webps
                    def files = findFiles(glob: 'resources/png/**')
                    files.each { f ->
                        def newpath = f.path.replace("/png", "/webp")
                        newpath = newpath.replace(".png", ".webp")
                        if (!f.directory) {
                            sh "~/webp/bin/cwebp -quiet -q 90 ${f.path} -o ${newpath}"
                        }
                    }
                }
                // actually build with jekyll
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
