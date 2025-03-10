# Action for Running MATLAB Tests
The [Run MATLAB Tests](#run-matlab-tests) action enables you to run MATLAB&reg; and Simulink&reg; tests and generate test and coverage artifacts on a [GitHub&reg;-hosted](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners/about-github-hosted-runners) or [self-hosted](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners) runner:
- To use a GitHub-hosted runner, include the [Setup MATLAB](https://github.com/matlab-actions/setup-matlab/) action in your workflow to set up your preferred MATLAB release (R2021a or later) on the runner.
- To use a self-hosted runner, set up a computer with MATLAB on its path to host your runner and register the runner with GitHub Actions. (On self-hosted UNIX&reg; runners, you can also use the **Setup MATLAB** action instead of having MATLAB installed.) The runner uses the topmost MATLAB release on the system path to execute your workflow.

## Examples
Use the **Run MATLAB Tests** action to automatically run tests authored using the MATLAB unit testing framework or Simulink Test&trade;. You can use this action with optional inputs to generate various test and coverage artifacts.

### Run Tests in MATLAB Project
On a self-hosted runner that has MATLAB installed, run the tests in your [MATLAB project](https://www.mathworks.com/help/matlab/projects.html). To run the tests, specify the **Run MATLAB Tests** action in your workflow.

```yaml
name: Run Tests in MATLAB Project
on: [push]
jobs:
  my-job:
    name: Run MATLAB Tests
    runs-on: self-hosted
    steps:
      - name: Check out repository
        uses: actions/checkout@v4
      - name: Run tests
        uses: matlab-actions/run-tests@v2
```

### Generate Test and Coverage Artifacts
Using the latest release of MATLAB on a GitHub-hosted runner, run the tests in your MATLAB project and generate test results in JUnit-style XML format and code coverage results in Cobertura XML format. To set up the latest release of MATLAB on the runner, specify the [Setup MATLAB](https://github.com/matlab-actions/setup-matlab/) action in your workflow. To run the tests and generate the artifacts, specify the **Run MATLAB Tests** action.

```yaml
name: Generate Test and Coverage Artifacts
on: [push]
jobs:
  my-job:
    name: Run MATLAB Tests
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v4
      - name: Set up MATLAB
        uses: matlab-actions/setup-matlab@v2
      - name: Run tests
        uses: matlab-actions/run-tests@v2
        with:
          test-results-junit: test-results/results.xml
          code-coverage-cobertura: code-coverage/coverage.xml
```

### Run Tests in Parallel
Run your MATLAB and Simulink tests in parallel (requires Parallel Computing Toolbox&trade;) using the latest release of the required products on a GitHub-hosted runner. To set up the latest release of MATLAB, Simulink, Simulink Test, and Parallel Computing Toolbox on the runner, specify the [Setup MATLAB](https://github.com/matlab-actions/setup-matlab/) action with its `products` input in your workflow. To run the tests in parallel, specify the **Run MATLAB Tests** action with its `use-parallel` input specified as `true`.

```YAML
name: Run Tests in Parallel
on: [push]
jobs:
  my-job:
    name: Run MATLAB and Simulink Tests
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v4
      - name: Set up products
        uses: matlab-actions/setup-matlab@v2
        with:
          products: >
            Simulink
            Simulink_Test
            Parallel_Computing_Toolbox
      - name: Run tests
        uses: matlab-actions/run-tests@v2
        with:
          use-parallel: true
``` 

### Use MATLAB Batch Licensing Token
When you set up your workflow using the [Setup MATLAB](https://github.com/matlab-actions/setup-matlab/) action, you need a [MATLAB batch licensing token](https://github.com/mathworks-ref-arch/matlab-dockerfile/blob/main/alternates/non-interactive/MATLAB-BATCH.md#matlab-batch-licensing-token) if your project is private or if your workflow includes transformation products, such as MATLAB Coder&trade; and MATLAB Compiler&trade;. Batch licensing tokens are strings that enable MATLAB to start in noninteractive environments. You can request a token by submitting the [MATLAB Batch Licensing Pilot](https://www.mathworks.com/support/batch-tokens.html) form. 

To use a MATLAB batch licensing token:

1. Set the token as a secret. For more information about secrets, see [Using secrets in GitHub Actions](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions).
2. Map the secret to an environment variable named `MLM_LICENSE_TOKEN` in your workflow. 

For example, use the latest release of MATLAB on a GitHub-hosted runner to run the tests in your private project. To set up the latest release of MATLAB on the runner, specify the **Setup MATLAB** action in your workflow. To run the tests, specify the **Run MATLAB Tests** action. In this example, `MyToken` is the name of the secret that holds the batch licensing token.

```YAML
name: Use MATLAB Batch Licensing Token
on: [push]
env:
  MLM_LICENSE_TOKEN: ${{ secrets.MyToken }}
jobs:
  my-job:
    name: Run MATLAB Tests in Private Project
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v4
      - name: Set up MATLAB
        uses: matlab-actions/setup-matlab@v2
      - name: Run tests
        uses: matlab-actions/run-tests@v2
```

## Run MATLAB Tests
When you define your workflow in the `.github/workflows` directory of your repository, specify the **Run MATLAB Tests** action as `matlab-actions/run-tests@v2`.

By default, the action includes any files in your project that have a `Test` label. If your workflow does not use a MATLAB project, or if it uses a MATLAB release before R2019a, then the action includes all tests in the root of your repository and in any of its subfolders. The action fails if any of the included tests fail.

The **Run MATLAB Tests** action accepts optional inputs. For example, you can add folders to the MATLAB search path, control which tests to run, and generate various artifacts.

Input                     | Description
------------------------- | ---------------
`source-folder`            | <p>(Optional) Location of the folder containing source code, specified as a path relative to the project root folder. The specified folder and its subfolders are added to the top of the MATLAB search path. If you specify `source-folder` and then generate a coverage report, the action uses only the source code in the specified folder and its subfolders to generate the report. You can specify multiple folders using a colon-separated or semicolon-separated list.</p><p>**Example:** `source-folder: source`<br/>**Example:** `source-folder: source/folderA; source/folderB`</p>
`select-by-folder`          | <p>(Optional) Location of the folder used to select test suite elements, specified as a path relative to the project root folder. To create a test suite, the action uses only the tests in the specified folder and its subfolders. You can specify multiple folders using a colon-separated or semicolon-separated list.</p><p>**Example:** `select-by-folder: test`<br/>**Example:** `select-by-folder: test/folderA; test/folderB`</p>
`select-by-tag`             | <p>(Optional) Test tag used to select test suite elements. To create a test suite, the action uses only the test elements with the specified tag.</p><p>**Example:** `select-by-tag: Unit`</p>
`strict`                  | <p>(Optional) Option to apply strict checks when running tests, specified as `false` or `true`. By default, the value is `false`. If you specify a value of `true`, the action generates a qualification failure whenever a test issues a warning.</p><p>**Example:** `strict: true`</p>
`use-parallel`              | <p>(Optional) Option to run tests in parallel, specified as `false` or `true`. By default, the value is `false` and tests run in serial. If the test runner configuration is suited for parallelization, you can specify a value of `true` to run tests in parallel. This input requires a Parallel Computing Toolbox license.</p><p>**Example:** `use-parallel: true`</p>
`output-detail`            | <p>(Optional) Amount of event detail displayed for the test run, specified as `none`, `terse`, `concise`, `detailed`, or `verbose`. By default, the action displays failing and logged events at the `detailed` level and test run progress at the `concise` level.<p></p>**Example:** `output-detail: verbose`</p>
`logging-level`            | <p>(Optional) Maximum verbosity level for logged diagnostics included for the test run, specified as `none`, `terse`, `concise`, `detailed`, or `verbose`. By default, the action includes diagnostics logged at the `terse` level.<p></p>**Example:** `logging-level: detailed`</p> 
`test-results-pdf`          | <p>(Optional) Location to write the test results in PDF format, specified as a path relative to the project root folder. On macOS platforms, this input is supported in MATLAB R2020b and later.</p><p>**Example:** `test-results-pdf: test-results/results.pdf`</p>
`test-results-junit`        | <p>(Optional) Location to write the test results in JUnit-style XML format, specified as a path relative to the project root folder.</p><p>**Example:** `test-results-junit: test-results/results.xml`</p>
`test-results-simulink-test` | <p>(Optional) Location to export Simulink Test Manager results in MLDATX format, specified as a path relative to the project root folder. This input requires a Simulink Test license and is supported in MATLAB R2019a and later.</p><p>**Example:** `test-results-simulink-test: test-results/results.mldatx`</p>
`code-coverage-cobertura`   | <p>(Optional) Location to write the code coverage results in Cobertura XML format, specified as a path relative to the project root folder.</p><p>**Example:** `code-coverage-cobertura: code-coverage/coverage.xml`</p>
`model-coverage-cobertura`  | <p>(Optional) Location to write the model coverage results in Cobertura XML format, specified as a path relative to the project root folder. This input requires a Simulink Coverage™ license and is supported in MATLAB R2018b and later.</p><p>**Example:** `model-coverage-cobertura: model-coverage/coverage.xml`</p>
`startup-options`         | <p>(Optional) MATLAB startup options, specified as a list of options separated by spaces. For more information about startup options, see [Commonly Used Startup Options](https://www.mathworks.com/help/matlab/matlab_env/commonly-used-startup-options.html).</p><p>Using this input to specify the `-batch` or `-r` option is not supported.</p><p>**Example:** `startup-options: -nojvm`<br/>**Example:** `startup-options: -nojvm -logfile output.log`</p>

## Notes
* By default, when you use the **Run MATLAB Tests** action, the root of your repository serves as the MATLAB startup folder. To run your tests using a different folder, specify the `-sd` startup option in the action.
* In MATLAB R2019a and later, the **Run MATLAB Tests** action uses  the `-batch` option to start MATLAB noninteractively. Preferences do not persist across different MATLAB sessions launched with the `-batch` option. To run code that requires the same preferences, use a single action.
* When you use the **Run MATLAB Tests** action, you execute third-party code that is licensed under separate terms.

## See Also
- [Action for Running MATLAB Builds](https://github.com/matlab-actions/run-build/)
- [Action for Running MATLAB Commands](https://github.com/matlab-actions/run-command/)
- [Action for Setting Up MATLAB](https://github.com/matlab-actions/setup-matlab/)
- [Continuous Integration with MATLAB and Simulink](https://www.mathworks.com/solutions/continuous-integration.html)

## Contact Us
If you have any questions or suggestions, contact MathWorks&reg; at [continuous-integration@mathworks.com](mailto:continuous-integration@mathworks.com).
