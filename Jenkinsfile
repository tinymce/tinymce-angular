#!groovy
@Library('waluigi') _

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
    checkout scm
  }

  stage("Building") {
    npmInstall()
    exec "yarn run build"
  }

  def permutations = [
    [ name: "win10Chrome", os: "windows-10", browser: "chrome" ],
    [ name: "win10FF", os: "windows-10", browser: "firefox" ],
    [ name: "win10Edge", os: "windows-10", browser: "MicrosoftEdge" ],
    [ name: "win10IE", os: "windows-10", browser: "ie" ]
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
        npmInstall()

        echo "Platform: browser tests for " + permutation.name
        bedrockTests(permutation.name, permutation.browser, "src/test/ts/browser")
      }
    }
  }

  stage("Parallel Browser Tests") {
    parallel processes
  }

  stage("Deploying storybook to github") {
    if (isReleaseBranch()) {
      sh 'npx storybook-to-ghpages'
    }
  }
}
