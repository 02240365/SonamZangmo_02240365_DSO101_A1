pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                git branch: 'main',
                    url: 'https://github.com/02240365/SonamZangmo_02240365_DSO101_A1.git'
            }
        }
        stage('Install Backend') {
            steps {
                dir('todo-app/backend') { sh 'npm install' }
            }
        }
        stage('Install Frontend') {
            steps {
                dir('todo-app/frontend') { sh 'npm install' }
            }
        }
        stage('Build Frontend') {
            steps {
                dir('todo-app/frontend') { sh 'npm run build' }
            }
        }
        stage('Build Backend') {
            steps {
                dir('todo-app/backend') { sh 'npm run build' }
            }
        }
        stage('Test Backend') {
            steps {
                dir('todo-app/backend') { sh 'npm test' }
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: 'todo-app/backend/junit.xml'
                }
            }
        }
        stage('Test Frontend') {
            steps {
                dir('todo-app/frontend') { sh 'npm test' }
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: 'todo-app/frontend/junit.xml'
                }
            }
        }
        stage('Deploy - Docker Build and Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | /usr/local/bin/docker login -u "$DOCKER_USER" --password-stdin
                        /usr/local/bin/docker build --platform linux/amd64 -t "$DOCKER_USER/be-todo:02240365" ./todo-app/backend
                        /usr/local/bin/docker push "$DOCKER_USER/be-todo:02240365"
                        /usr/local/bin/docker build --platform linux/amd64 -t "$DOCKER_USER/fe-todo:02240365" ./todo-app/frontend
                        /usr/local/bin/docker push "$DOCKER_USER/fe-todo:02240365"
                        echo "All images pushed successfully"
                    '''
                }
            }
        }
    }
    post {
        success { echo 'Pipeline completed successfully!' }
        failure { echo 'Pipeline FAILED.' }
    }
}
