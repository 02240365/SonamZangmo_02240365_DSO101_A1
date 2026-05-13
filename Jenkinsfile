pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        DOCKERHUB_USERNAME = '02240365'
        STUDENT_ID = '02240365'
        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/be-todo:${STUDENT_ID}"
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/fe-todo:${STUDENT_ID}"
    }

    stages {

        // Stage 1: Checkout Code from GitHub
        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub...'
                git branch: 'main',
                    url: 'https://github.com/02240365/SonamZangmo_02240365_DSO101_A1.git'
            }
        }

        // Stage 2: Install Backend Dependencies
        stage('Install Backend') {
            steps {
                echo 'Installing backend dependencies...'
                dir('todo-app/backend') {
                    sh 'npm install'
                }
            }
        }

        // Stage 3: Install Frontend Dependencies
        stage('Install Frontend') {
            steps {
                echo 'Installing frontend dependencies...'
                dir('todo-app/frontend') {
                    sh 'npm install'
                }
            }
        }

        // Stage 4: Build Frontend
        stage('Build Frontend') {
            steps {
                echo 'Building React frontend...'
                dir('todo-app/frontend') {
                    sh 'npm run build'
                }
            }
        }

        // Stage 5: Build Backend (echo only, no compile needed)
        stage('Build Backend') {
            steps {
                echo 'Building backend...'
                dir('todo-app/backend') {
                    sh 'npm run build'
                }
            }
        }

        // Stage 6: Run Backend Unit Tests
        stage('Test Backend') {
            steps {
                echo 'Running backend unit tests...'
                dir('todo-app/backend') {
                    sh 'npm test'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: 'todo-app/backend/junit.xml'
                }
            }
        }

        // Stage 7: Run Frontend Unit Tests
        stage('Test Frontend') {
            steps {
                echo 'Running frontend unit tests...'
                dir('todo-app/frontend') {
                    sh 'npm test'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: 'todo-app/frontend/junit.xml'
                }
            }
        }

        // Stage 8: Build and Push Docker Images
        stage('Deploy - Build & Push Docker Images') {
            steps {
                echo 'Building and pushing Docker images to Docker Hub...'
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-creds') {

                        // Build and push backend
                        def backendImage = docker.build("${BACKEND_IMAGE}", './todo-app/backend')
                        backendImage.push()
                        echo "Backend image pushed: ${BACKEND_IMAGE}"

                        // Build and push frontend
                        def frontendImage = docker.build("${FRONTEND_IMAGE}", './todo-app/frontend')
                        frontendImage.push()
                        echo "Frontend image pushed: ${FRONTEND_IMAGE}"
                    }
                }
            }
        }

    }

    post {
        success {
            echo '=========================================='
            echo 'Pipeline completed successfully!'
            echo "Backend Image: ${BACKEND_IMAGE}"
            echo "Frontend Image: ${FRONTEND_IMAGE}"
            echo '=========================================='
        }
        failure {
            echo '=========================================='
            echo 'Pipeline FAILED. Check the logs above.'
            echo '=========================================='
        }
        always {
            echo 'Pipeline finished.'
        }
    }
}
