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
      environment { SONAR_TOKEN = credentials('SONAR_TOKEN') }
      steps {
        sh '''
          # ─── Force Java 17 ───────────────────────────────────────────────
          export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
          export PATH=$JAVA_HOME/bin:$PATH
          java -version           # should print "17.0.x"

          # ─── Download & run SonarScanner ────────────────────────────────
          curl -sSLo sonar-scanner.zip \
            https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.8.0.2856-linux.zip
          rm -rf sonar-scanner-4.8.0.2856-linux
          unzip -o -qq sonar-scanner.zip

          ./sonar-scanner-4.8.0.2856-linux/bin/sonar-scanner \
            -Dsonar.host.url=https://sonarcloud.io \
            -Dsonar.login=$SONAR_TOKEN \
            -Dsonar.organization=bensaviofernandez \
            -Dsonar.projectKey=bensaviofernandez_8.2CDevSecOps \
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
