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
    resourceLimitMemory: '4Gi'
  ],
  customSteps: {
    stage("storybook") {
      def status = beehiveFlowStatus()
      if (status.branchState == 'releaseReady' && status.isLatest) {
        sshagent (credentials: ['3e856116-029e-4c8d-b57d-593b2fba3cb2']) {
          exec('yarn storybook-to-ghpages')
        }
      } else {
        echo "Skipping as is not latest release"
      }
    }
  },
  publish: {
    tinyNpm.withNpmPublishCredentials('dist/tinymce-angular') {
      sh "yarn beehive-flow publish --working-dir dist/tinymce-angular"
    }
  }
)
