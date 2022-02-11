properties([
    disableConcurrentBuilds() // This limits build concurrency to 1 per branch
])

node('fu && node14') {
    try {

        def stageName = "${env.BRANCH_NAME.toLowerCase().replaceAll('-','').replaceAll('/','')}"

        stage('Checkout') {
            checkout scm
        }

        stage('Install') {
            sh "npm ci"
        }

        stage('Testing') {
            sh "npm run test"
        }

        stage('Build') {
            sh """
                npm run build
                npm run build:es2015
                npm run build:esm5
                npm run build:types
            """
        }

        stage('Publish') {
            if (env.BRANCH_NAME == 'master') {
                sh """
                    . /usr/local/bin/assume_build.sh
                    . /usr/local/bin/code_artifact_login.sh
                    npm run publish:all
                """
            }
        }

        echo "Success, with result: ${currentBuild.result}"

    } catch(e) {
         currentBuild.result = "FAILURE"
         echo "Build failed, with result: ${currentBuild.result}"
    }
}
