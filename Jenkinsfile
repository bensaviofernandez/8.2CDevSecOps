pipeline {
  agent any
  tools {
    nodejs 'Node18'
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Install') {
      steps { sh 'npm ci' }
    }
    stage('Unit & Coverage Tests') {
      steps { sh 'npm test -- --coverage --passWithNoTests' }
      post { always { archiveArtifacts artifacts: 'coverage/**', fingerprint: true } }
    }
    stage('SonarCloud Analysis') {
      environment {
        SONAR_TOKEN = credentials('SONAR_TOKEN')
      }
      steps {
      sh '''
        # Download SonarScanner CLI (small zip, no install)
        curl -sSLo sonar-scanner.zip \
          https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.8.0.2856-linux.zip
        unzip -qq sonar-scanner.zip
        ./sonar-scanner-*/bin/sonar-scanner \
          -Dsonar.login=$SONAR_TOKEN
      '''
      }
    }

    stage('Security Audit') {
      steps { sh 'npm audit --json > audit.json || true' }
      post { always { archiveArtifacts artifacts: 'audit.json', fingerprint: true } }
    }
  }
}
