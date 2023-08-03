pipeline {
    agent any
    environment {
        RSYNC_SSH = credentials('NETRSYNCSSH')
        SSH_CONNECTION = credentials('NETSSHCONNECTION')
        // directories to exclude from uploading (either too big or managed manually)
        EXCLUDES = "--exclude /resources/json/aXoUztUmqZpBb8pz --exclude /resources/png/xshQS5ZxxjzMEsQ5 --exclude /resources/webp/xshQS5ZxxjzMEsQ5"
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
                // replace all /resources with resources.egartley.net
                script {
                    def matches = ["*.html", "*.css", "*.js"]
                    for (int i = 0; i < matches.size(); ++i) {
                        sh "find . -type f -name \"${matches[i]}\" -print0 | xargs -0 sed -i 's/\\/resources\\//https:\\/\\/resources.egartley.net\\//g'"
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
                    def path = "public_html"
                    if (params.DEPLOYLOCATION == "test") {
                        path = path + "/test"
                    }
                    sh 'sudo rsync -rP -e "${RSYNC_SSH}" ${EXCLUDES} _site/ ${SSH_CONNECTION}:${path}'
                }
            }
        }
    }
}
