# Action for Running MATLAB Tests

The [Run MATLAB Tests](#run-matlab-tests) action enables you to run MATLAB&reg; and Simulink&reg; tests and generate test and coverage artifacts on a self-hosted or GitHub&reg;-hosted runner. The action uses the topmost MATLAB version on the system path.

## Examples
Use the **Run MATLAB Tests** action to automatically run tests authored using the MATLAB unit testing framework or Simulink Test&trade;. You can use this action with optional inputs to generate various test and coverage artifacts.

### Run MATLAB Tests on Self-Hosted Runner
Use a [self-hosted runner](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners) to run the tests in your [MATLAB project](https://www.mathworks.com/help/matlab/projects.html).

```yaml
name: Run MATLAB Tests on Self-Hosted Runner
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

### Generate Artifacts on GitHub-Hosted Runner
Before you run tests and generate artifacts on a [GitHub-hosted runner](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners/about-github-hosted-runners), first use the [Setup MATLAB](https://github.com/matlab-actions/setup-matlab/) action. The action sets up your specified MATLAB release (R2021a or later) on a Linux&reg;, Windows&reg;, or macOS runner. If you do not specify a release, the action sets up the latest release of MATLAB.

For example, set up the latest release of MATLAB on a GitHub-hosted runner, and then use the **Run MATLAB Tests** action to run the tests in your MATLAB project and generate test results in JUnit-style XML format and code coverage results in Cobertura XML format.

```yaml
name: Generate Test and Coverage Artifacts on GitHub-Hosted Runner
on: [push]
jobs:
  my-job:
    name: Run MATLAB Tests and Generate Artifacts
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v4
      - name: Set up MATLAB
        uses: matlab-actions/setup-matlab@v2
      - name: Run tests and generate artifacts
        uses: matlab-actions/run-tests@v2
        with:
          test-results-junit: test-results/results.xml
          code-coverage-cobertura: code-coverage/coverage.xml
```
## Run MATLAB Tests
When you define your workflow in the `.github/workflows` directory of your repository, specify the **Run MATLAB Tests** action as `matlab-actions/run-tests@v2`.

By default, MATLAB includes any files in your project that have a `Test` label. If your workflow does not use a MATLAB project, or if it uses a MATLAB release before R2019a, then MATLAB includes all tests in the root of your repository and in any of its subfolders.

The **Run MATLAB Tests** action lets you customize your test run using optional inputs. For example, you can add folders to the MATLAB search path, control which tests to run, and generate various artifacts.

Input                     | Description
------------------------- | ---------------
`source-folder`            | <p>(Optional) Location of the folder containing source code, relative to the project root folder. The specified folder and its subfolders are added to the top of the MATLAB search path. If you specify `source-folder` and then generate a coverage report, MATLAB uses only the source code in the specified folder and its subfolders to generate the report. You can specify multiple folders using a colon-separated or semicolon-separated list.<p/><p>**Example:** `source-folder: source`<br/>**Example:** `source-folder: source/folderA; source/folderB`</p>
`select-by-folder`          | <p>(Optional) Location of the folder used to select test suite elements, relative to the project root folder. To create a test suite, MATLAB uses only the tests in the specified folder and its subfolders. You can specify multiple folders using a colon-separated or semicolon-separated list.<p/><p>**Example:** `select-by-folder: test`<br/>**Example:** `select-by-folder: test/folderA; test/folderB`</p>
`select-by-tag`             | <p>(Optional) Test tag used to select test suite elements. To create a test suite, MATLAB uses only the test elements with the specified tag.<p/><p>**Example:** `select-by-tag: Unit`</p>
`strict`                  | <p>(Optional) Option to apply strict checks when running tests, specified as `false` or `true`. By default, the value is `false`. If you specify a value of `true`, the action generates a qualification failure whenever a test issues a warning.<p/><p>**Example:** `strict: true`</p>
`use-parallel`              | <p>(Optional) Option to run tests in parallel on a self-hosted runner, specified as `false` or `true`. By default, the value is `false` and tests run in serial. If the test runner configuration is suited for parallelization, you can specify a value of `true` to run tests in parallel. This input requires a Parallel Computing Toolbox&trade; license and is supported only on self-hosted runners.</p><p>**Example:** `use-parallel: true`</p>
`output-detail`            | <p>(Optional) Amount of event detail displayed for the test run, specified as `none`, `terse`, `concise`, `detailed`, or `verbose`. By default, the action displays failing and logged events at the `detailed` level and test run progress at the `concise` level.<p></p>**Example:** `output-detail: verbose`</p>
`logging-level`            | <p>(Optional) Maximum verbosity level for logged diagnostics included for the test run, specified as `none`, `terse`, `concise`, `detailed`, or `verbose`. By default, the action includes diagnostics logged at the `terse` level.<p></p>**Example:** `logging-level: detailed`</p> 
`test-results-pdf`          | <p>(Optional) Path to write the test results in PDF format. On macOS platforms, this input is supported in MATLAB R2020b and later.</p><p>**Example:** `test-results-pdf: test-results/results.pdf`</p>
`test-results-junit`        | <p>(Optional) Path to write the test results in JUnit-style XML format.</p><p>**Example:** `test-results-junit: test-results/results.xml`</p>
`test-results-simulink-test` | <p>(Optional) Path to export Simulink Test Manager results in MLDATX format. This input requires a Simulink Test license, and is supported in MATLAB R2019a and later.</p><p>**Example:** `test-results-simulink-test: test-results/results.mldatx`</p>
`code-coverage-cobertura`   | <p>(Optional) Path to write the code coverage results in Cobertura XML format.</p><p>**Example:** `code-coverage-cobertura: code-coverage/coverage.xml`</p>
`model-coverage-cobertura`  | <p>(Optional) Path to write the model coverage results in Cobertura XML format. This input requires a Simulink Coverage™ license, and is supported in MATLAB R2018b and later.</p><p>**Example:** `model-coverage-cobertura: model-coverage/coverage.xml`</p>
`startup-options`         | <p>(Optional) MATLAB startup options, specified as a list of options separated by spaces. For more information about startup options, see [Commonly Used Startup Options](https://www.mathworks.com/help/matlab/matlab_env/commonly-used-startup-options.html).<p/><p>Using this input to specify the `-batch` or `-r` option is not supported.<p/><p>**Example:** `startup-options: -nojvm`<br/>**Example:** `startup-options: -nojvm -logfile output.log`</p>

## Notes
* By default, when you use the **Run MATLAB Tests** action, the root of your repository serves as the MATLAB startup folder. To run your tests using a different folder, include the `-sd` startup option or the `cd` command in the action.
* In MATLAB R2019a and later, the **Run MATLAB Tests** action uses  the `-batch` option to start MATLAB. Preferences do not persist across different MATLAB sessions launched with the `-batch` option. To run code that requires the same preferences, use a single action.
* When you use the **Run MATLAB Tests** action, you execute third-party code that is licensed under separate terms.

## See Also
- [Action for Running MATLAB Builds](https://github.com/matlab-actions/run-build/)
- [Action for Running MATLAB Commands](https://github.com/matlab-actions/run-command/)
- [Action for Setting Up MATLAB](https://github.com/matlab-actions/setup-matlab/)
- [Continuous Integration with MATLAB and Simulink](https://www.mathworks.com/solutions/continuous-integration.html)

## Contact Us
If you have any questions or suggestions, please contact MathWorks&reg; at [continuous-integration@mathworks.com](mailto:continuous-integration@mathworks.com).
