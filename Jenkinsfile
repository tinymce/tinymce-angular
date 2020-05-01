#!groovy
@Library('waluigi@v3.2.0') _

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

  if (isReleaseBranch()) {
    stage("Deploying storybook to github") {
      sshagent (credentials: ['ccde5b3d-cf13-4d70-88cf-ae1e6dfd4ef4']) {
        sh 'yarn storybook-to-ghpages'
      }
    }
  }

  if (isReleaseBranch() && isPackageNewerVersion()) {
    stage("Publish") {
      sh 'yarn run build'
      sh 'cd dist/tinymce-angular && npm publish'
    }
  }
}