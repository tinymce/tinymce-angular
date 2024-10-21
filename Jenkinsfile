#!groovy
@Library('waluigi@release/7') _

mixedBeehiveFlow(
  testPrefix: 'Tiny-Angular',
  testDirs: [ "tinymce-angular-component/src/test/ts/browser" ],
  platforms: [
    [ browser: 'chrome', headless: true ],
    [ browser: 'firefox', provider: 'aws', buckets: 1 ],
    [ browser: 'safari', provider: 'lambdatest', os: 'macOS Sonoma', buckets: 1 ]
  ],
  testContainer: [
    tag: '20',
    resourceRequestMemory: '4Gi',
    resourceLimitCpu: '4',
    resourceLimitMemory: '4Gi',
    selenium: [ image: "selenium/standalone-chrome:127.0" ]
  ],
  publishContainer: [
    resourceRequestMemory: '4Gi',
    resourceLimitMemory: '4Gi'
  ],
  customSteps: {
    stage("update storybook") {
      def status = beehiveFlowStatus()
      if (status.branchState == 'releaseReady' && status.isLatest) {
        tinyGit.withGitHubSSHCredentials {
          exec('yarn deploy-storybook')
        }
      } else {
        echo "Skipping as is not latest release"
      }
    }
  },
  publish: {
    sh "yarn build"
    tinyNpm.withNpmPublishCredentials('dist/tinymce-angular') {
      sh "yarn beehive-flow publish --working-dir dist/tinymce-angular"
    }
  }
)
