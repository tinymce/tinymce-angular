#!groovy
@Library('waluigi@v2.0.0') _

properties([
  disableConcurrentBuilds(),
  pipelineTriggers([
    pollSCM('H 0 1 1 1')
  ])
])

node("primary") {
  echo "Clean workspace"
  cleanWs()

  stage ("Checkout SCM") {
    checkout localBranch(scm)
  }

  stage("Building") {
    yarnInstall()
    exec "yarn run build"
  }

  def permutations = [
    [ name: "win10Chrome", os: "windows-10", browser: "chrome" ],
    [ name: "win10FF", os: "windows-10", browser: "firefox" ],
    [ name: "win10Edge", os: "windows-10", browser: "MicrosoftEdge" ]
  ]

  def processes = [:]

  for (int i = 0; i < permutations.size(); i++) {
    def permutation = permutations.get(i);
    def name = permutation.name;
    processes[name] = {
      node("bedrock-" + permutation.os) {
        echo "Clean workspace"
        cleanWs()

        echo "Checkout"
        checkout scm

        echo "Installing tools"
        yarnInstall()

        echo "Platform: browser tests for " + permutation.name
        bedrockTests(permutation.name, permutation.browser, "tinymce-angular-component/src/test/ts/browser")
      }
    }
  }

  stage("Parallel Browser Tests") {
    parallel processes
  }

  stage("Deploying storybook to github") {
    if (isReleaseBranch()) {
      sshagent (credentials: ['ccde5b3d-cf13-4d70-88cf-ae1e6dfd4ef4']) {
        sh 'yarn storybook-to-ghpages'
      }
    }
  }

  if (isReleaseBranch() && isReleasable()) {
    stage("Publish") {
      sh 'yarn run publish'
    }
  }
}

def isNewerVersion(String current, String next) {
  List currentV = current.tokenize('.')
  List nextV = next.tokenize('.')
  def minIndex = Math.min(currentV.size(), nextV.size())
  for (int i = 0; i < minIndex; i++) {
    if (nextV[i].toInteger() > currentV[i].toInteger()) {
      return true
    } else if (nextV[i].toInteger() < currentV[i].toInteger()) {
      return false
    }
  }
  return false
}

def isReleasable() {
  def packageName = sh(script: 'npm run package-name -s', returnStdout: true).trim()
  echo "Checking releasability for package: " + packageName
  if (packageName) {
    def remoteVersion = sh(script: "npm view ${packageName} version", returnStdout: true)
    echo "Validating remote version: " + remoteVersion
    def localVersion = sh(script: 'npm run package-version -s', returnStdout: true)
    echo "Validating local version: " + localVersion
    if (localVersion) {
      return isNewerVersion(remoteVersion, localVersion)
    }
  }
  return false
}