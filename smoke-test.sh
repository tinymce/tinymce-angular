#!/bin/bash

export NEXT_VERSION=$(npm view @angular/core@next version)
export ROUTE_FILE_PATH=version.json

yarn add @angular/animations@next @angular/common@next @angular/compiler@next @angular/core@next @angular/forms@next @angular/platform-browser@next @angular-devkit/build-angular@next @angular/cli@next @angular/compiler-cli@next

yarn build

# Build the custom route file with the next Angular version to be used in the test
printf '
  [{
    "request": {
      "method": "get",
      "path": "/custom/integration/info"
    },
    "response": {
      "status": 200,
      "json": {
        "version": "%s"
      }
    }
  }]
' "$NEXT_VERSION" > $ROUTE_FILE_PATH

yarn bedrock-auto -b chrome -f tinymce-angular-component/src/test/ts/smoke-test/VerifyIntegrationTest.ts --customRoutes $ROUTE_FILE_PATH
