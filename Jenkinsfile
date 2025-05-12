pipeline {
  agent any

  /* Node 18 tool that you configured in Jenkins → Global Tools */
  tools { nodejs 'Node18' }

  /* Expose the personal token you generated on SonarCloud (My Account ▸ Security) */
  environment {
    SONAR_TOKEN = credentials('SONAR_TOKEN')      // secret‑text credential
  }

  stages {

    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install') {
      steps { sh 'npm ci' }
    }

    stage('Unit & Coverage Tests') {
      steps { sh 'npm test -- --coverage --passWithNoTests' }
      post { always { archiveArtifacts artifacts: 'coverage/**', fingerprint: true } }
    }

    stage('SonarCloud Analysis') {
      steps {
        sh '''
          #--- Run the scanner inside an ephemeral container ----------------------
          docker run --rm \
            -e SONAR_TOKEN=$SONAR_TOKEN \
            -v "$PWD:/usr/src" \
            sonarsource/sonar-scanner-cli:4.8 \
              -Dsonar.host.url=https://sonarcloud.io \
              -Dsonar.organization=bensaviofernandez \
              -Dsonar.projectKey=bensaviofernandez_8.2CDevSecOps \
              -Dsonar.token=$SONAR_TOKEN \
              -Dsonar.sources=. \
              -Dsonar.exclusions=node_modules/** \
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
