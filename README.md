# Action for Running MATLAB Tests

The [Run MATLAB Tests](#run-matlab-tests) action enables you to run MATLAB&reg; and Simulink&reg; tests and generate artifacts such as JUnit test results and Cobertura code coverage reports. You can run tests and generate artifacts on a [self-hosted](https://docs.github.com/en/free-pro-team@latest/actions/hosting-your-own-runners/about-self-hosted-runners) or [GitHub&reg;-hosted](https://docs.github.com/en/free-pro-team@latest/actions/reference/specifications-for-github-hosted-runners) runner:

- To use a self-hosted runner, you must set up a computer with MATLAB (R2013b or later) as your runner. The runner uses the topmost MATLAB version on the system path to execute your workflow.

- To use a GitHub-hosted runner, you must include the [Setup MATLAB](https://github.com/matlab-actions/setup-matlab/) action in your workflow to set up MATLAB on the runner. Currently, this action is available only for public projects. It does not set up transformation products, such as MATLAB Coder&trade; and MATLAB Compiler&trade;.

## Examples
Use the **Run MATLAB Tests** action to automatically run tests authored using the MATLAB unit testing framework or Simulink Test&trade;. You can use this action with optional inputs to generate various test and coverage artifacts.

### Run MATLAB Tests on Self-Hosted Runner
Use a self-hosted runner to automatically run the tests in your [MATLAB project](https://www.mathworks.com/help/matlab/projects.html).

```yaml
name: Run MATLAB Tests on Self-Hosted Runner
on: [push]
jobs:
  my-job:
    name: Run MATLAB Tests
    runs-on: self-hosted
    steps:
      - name: Check out repository
        uses: actions/checkout@v2
      - name: Run tests
        uses: matlab-actions/run-tests@v1
```

### Generate Test Artifacts on GitHub-Hosted Runner
Before you run tests and generate artifacts on a GitHub-hosted runner, first use the [Setup MATLAB](https://github.com/matlab-actions/setup-matlab/) action. The action sets up your specified MATLAB release (R2020a or later) on a Linux&reg; virtual machine. If you do not specify a release, the action sets up the latest release of MATLAB.

For example, set up the latest release of MATLAB on a GitHub-hosted runner, and then use the **Run MATLAB Tests** action to run the tests in your MATLAB project and generate a JUnit test results report and a Cobertura code coverage report.

```yaml
name: Generate Test Artifacts on GitHub-Hosted Runner
on: [push]
jobs:
  my-job:
    name: Run MATLAB Tests and Generate Artifacts
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v2
      - name: Set up MATLAB
        uses: matlab-actions/setup-matlab@v1
      - name: Run tests and generate artifacts
        uses: matlab-actions/run-tests@v1
        with:
          test-results-junit: test-results/results.xml
          code-coverage-cobertura: code-coverage/coverage.xml
```
## Run MATLAB Tests
When you define your workflow in the `.github/workflows` directory of your repository, specify the **Run MATLAB Tests** action as `matlab-actions/run-tests@v1`.

By default, MATLAB includes any files in your project that have a `Test` label. If your workflow does not use a MATLAB project, or if it uses a MATLAB release before R2019a, then MATLAB includes all tests in the root of your repository and in any of its subfolders.

The **Run MATLAB Tests** action lets you customize your test run using optional inputs. For example, you can add folders to the MATLAB search path, control which tests to run, and generate various artifacts.

Input                     | Description
------------------------- | ---------------
`source-folder`            | (Optional) Location of the folder containing source code, relative to the project root folder. The specified folder and its subfolders are added to the top of the MATLAB search path. If you specify `source-folder` and then generate a coverage report, MATLAB uses only the source code in the specified folder and its subfolders to generate the report. You can specify multiple folders using a colon-separated or semicolon-separated list.<br/>**Example:** `source`<br/>**Example:** `source/folderA; source/folderB`
`use-parallel`              | (Optional) Whether to run tests in parallel on a self-hosted runner, specified as `false` or `true`. By default, the value is `false` and tests run in serial. If the test runner configuration is suited for parallelization, you can specify a value of `true` to run tests in parallel. This input requires a Parallel Computing Toolbox™ license and is supported only on self-hosted runners.
`select-by-folder`          | (Optional) Location of the folder used to select test suite elements, relative to the project root folder. To create a test suite, MATLAB uses only the tests in the specified folder and its subfolders. You can specify multiple folders using a colon-separated or semicolon-separated list.<br/>**Example:** `test`<br/>**Example:** `test/folderA; test/folderB`
`select-by-tag`             | (Optional) Test tag used to select test suite elements. To create a test suite, MATLAB uses only the test elements with the specified tag.<br/>**Example:** `Unit`
`test-results-pdf`          | (Optional) Path to write test results report in PDF format. On macOS platforms, this input is supported in MATLAB R2020b and later.<br/>**Example:** `test-results/results.pdf`
`test-results-junit`        | (Optional) Path to write test results report in JUnit XML format.<br/>**Example:** `test-results/results.xml`
`test-results-simulink-test` | (Optional) Path to export Simulink Test Manager results in MLDATX format. This input requires a Simulink Test license, and is supported in MATLAB R2019a and later.<br/>**Example:** `test-results/results.mldatx`
`code-coverage-cobertura`   | (Optional) Path to write code coverage report in Cobertura XML format.<br/>**Example:** `code-coverage/coverage.xml`
`model-coverage-cobertura`  | (Optional) Path to write model coverage report in Cobertura XML format. This input requires a Simulink Coverage™ license, and is supported in MATLAB R2018b and later.<br/>**Example:** `model-coverage/coverage.xml`

## Notes
* In MATLAB R2019a and later, the **Run MATLAB Tests** action uses  the `-batch` option to start MATLAB noninteractively. Preferences do not persist across different MATLAB sessions launched with the `-batch` option. To run code that requires the same preferences, use a single action.
* When you use the **Run MATLAB Tests** action, you execute third-party code that is licensed under separate terms.

## See Also
- [Action for Running MATLAB Commands](https://github.com/matlab-actions/run-command/)
- [Action for Setting Up MATLAB on GitHub-Hosted Runner](https://github.com/matlab-actions/setup-matlab/)
- [Continuous Integration with MATLAB and Simulink](https://www.mathworks.com/solutions/continuous-integration.html)

## Contact Us
If you have any questions or suggestions, please contact MathWorks&reg; at [continuous-integration@mathworks.com](mailto:continuous-integration@mathworks.com).
