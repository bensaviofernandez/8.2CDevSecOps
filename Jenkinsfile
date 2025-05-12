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
          # download scanner
          curl -sSLo sonar-scanner.zip \
            https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.8.0.2856-linux.zip
          unzip -qq sonar-scanner.zip

          # run scanner with all props inline
          ./sonar-scanner-*/bin/sonar-scanner \
            -Dsonar.host.url=https://sonarcloud.io \
            -Dsonar.login=$SONAR_TOKEN \
            -Dsonar.organization=bensaviofernandez      \\
            -Dsonar.projectKey=bensaviofernandez_8.2CDevSecOps  \\
            -Dsonar.sources=.                            \\
            -Dsonar.exclusions=node_modules/**           \\
            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
        '''
      }
    }


    stage('Security Audit') {
      steps { sh 'npm audit --json > audit.json || true' }
      post { always { archiveArtifacts artifacts: 'audit.json', fingerprint: true } }
    }
  }
}
