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
    stage('Security Audit') {
      steps { sh 'npm audit --json > audit.json || true' }
      post { always { archiveArtifacts artifacts: 'audit.json', fingerprint: true } }
    }
  }
}
