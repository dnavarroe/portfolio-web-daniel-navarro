# SkillsPage Grid Test Fix Design

## Overview

The test "should render skills in a grid layout" fails because it attempts to query for grid elements using `container.querySelectorAll('.grid')` before the component has fully rendered with data. The SkillsPage component uses Tailwind CSS utility classes (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) which should be matchable by the `.grid` selector, but the test executes the query before the async data loading completes and the grid elements are rendered to the DOM. The fix requires waiting for the component to fully render with loaded data before querying for grid elements.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when the test queries for `.grid` elements before the SkillsPage component has completed async data loading and rendering
- **Property (P)**: The desired behavior - the test should successfully find grid elements after the component has rendered with loaded skills data
- **Preservation**: The certifications grid test and all other SkillsPage tests must continue to pass; the component's Tailwind CSS styling must remain unchanged
- **renderSkillsPage**: The test helper function that renders the SkillsPage component with mocked dependencies
- **ContentLoader.loadSkills**: The async function that loads skills data, mocked in tests to return `mockSkillsData`
- **waitFor**: React Testing Library utility that waits for assertions to pass within a timeout period

## Bug Details

### Bug Condition

The bug manifests when the test queries for grid elements using `container.querySelectorAll('.grid')` inside a `waitFor` block, but the query executes before the SkillsPage component has completed its async data loading and rendered the grid containers to the DOM. Even though `waitFor` is used, the assertion `expect(grids.length).toBeGreaterThan(0)` fails immediately because the query returns an empty NodeList before any retries can occur.

**Formal Specification:**
```
FUNCTION isBugCondition(testExecution)
  INPUT: testExecution of type TestExecution
  OUTPUT: boolean
  
  RETURN testExecution.querySelector == '.grid'
         AND testExecution.queryTiming == 'before-data-loaded'
         AND testExecution.componentState == 'loading'
         AND NOT gridElementsRendered(testExecution.container)
END FUNCTION
```

### Examples

- **Test execution with immediate query**: Test calls `container.querySelectorAll('.grid')` → Returns empty NodeList (length 0) → Assertion fails
- **Expected behavior**: Test waits for skills data to load → Component renders grid containers → Query finds grid elements → Assertion passes
- **Certifications test (working)**: Uses `screen.getByRole('heading', { name: 'Certificaciones' })` which implicitly waits for the heading to render → Then queries for grid → Succeeds because data is already loaded
- **Edge case**: If `ContentLoader.loadSkills` mock fails or returns empty data → Grid elements may not render → Test should handle this gracefully

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- The certifications grid test must continue to pass with its current implementation
- All other tests in the SkillsPage test suite must continue to pass without modification
- The SkillsPage component must continue to use Tailwind CSS utility classes for grid styling
- The component's rendering logic and data loading flow must remain unchanged

**Scope:**
All tests and component behavior that do NOT involve the specific "should render skills in a grid layout" test should be completely unaffected by this fix. This includes:
- Other layout and rendering tests
- Data loading and error handling tests
- User interaction tests
- The certifications grid test implementation

## Hypothesized Root Cause

Based on the bug description and code analysis, the most likely issues are:

1. **Timing Issue with waitFor**: The `waitFor` block contains the query and assertion together, but `querySelectorAll` doesn't throw an error when it finds no elements - it just returns an empty NodeList. This means `waitFor` doesn't retry because no error is thrown, and the assertion fails on the first attempt before the component has rendered.

2. **Missing Implicit Wait**: Unlike the certifications test which uses `screen.getByRole` (which waits for the element to appear), this test uses `container.querySelectorAll` which executes immediately without waiting for elements to exist.

3. **Async Data Loading Not Awaited**: The test doesn't explicitly wait for the mocked `ContentLoader.loadSkills` to resolve and for the component to re-render with the loaded data before querying for grid elements.

4. **Query Selector Specificity**: While less likely, the `.grid` selector should match elements with `className="grid grid-cols-1..."`, but there could be an issue with how the selector is interpreted or how the component renders the class attribute.

## Correctness Properties

Property 1: Bug Condition - Grid Elements Found After Data Load

_For any_ test execution where the SkillsPage component is rendered and skills data is successfully loaded, the test SHALL find grid elements using an appropriate query method that waits for the component to complete rendering, and the assertion SHALL pass by confirming that grid layout elements exist in the DOM.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation - Other Tests Unchanged

_For any_ test in the SkillsPage test suite that is NOT the "should render skills in a grid layout" test, the fixed code SHALL produce exactly the same test results as the original code, preserving all existing test behavior including the certifications grid test.

**Validates: Requirements 3.1, 3.2, 3.3**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct (timing issue with waitFor and immediate query execution):

**File**: `src/pages/SkillsPage.test.tsx`

**Test**: `should render skills in a grid layout` (line 270-276)

**Specific Changes**:
1. **Replace immediate query with element wait**: Instead of querying for `.grid` elements directly, first wait for a known element that appears after data loads (like a skill category heading or skill card)

2. **Use screen queries with implicit waiting**: Replace `container.querySelectorAll('.grid')` with a `screen` query that waits for content to appear, such as `screen.getByText` for a skill name or category

3. **Query for grid after content verification**: After confirming that skills have rendered, then query for grid elements using `container.querySelectorAll('.grid')` or a more specific selector

4. **Alternative approach - Use data-testid**: Add a `data-testid="skills-grid"` attribute to the grid container in SkillsPage.tsx and query using `screen.getByTestId('skills-grid')` for more reliable element selection

5. **Align with certifications test pattern**: Follow the same pattern as the certifications test by first finding a heading or section, then querying for the grid within that context

**Recommended Solution** (minimal change):
```typescript
it('should render skills in a grid layout', async () => {
  const { container } = renderSkillsPage();

  // Wait for skills to load by checking for a skill category heading
  await waitFor(() => {
    expect(screen.getByText(/Frontend|Backend|DevOps/i)).toBeInTheDocument();
  });

  // Now query for grid elements after data has loaded
  const grids = container.querySelectorAll('.grid');
  expect(grids.length).toBeGreaterThan(0);
});
```

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, confirm the bug exists by running the unfixed test and observing the failure, then verify the fix works correctly and preserves existing test behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm that the test fails due to timing issues with async data loading.

**Test Plan**: Run the existing test on the UNFIXED code and observe the failure. Add console.log statements to verify that `querySelectorAll('.grid')` returns an empty NodeList and that the component state is still loading when the query executes.

**Test Cases**:
1. **Immediate Query Test**: Run the current test implementation (will fail on unfixed code)
2. **Timing Verification**: Add logging to confirm query executes before data loads (will show empty NodeList on unfixed code)
3. **Component State Check**: Verify that the component is in loading state when query executes (will confirm timing issue on unfixed code)
4. **Manual DOM Inspection**: Check if grid elements eventually appear after the test fails (will confirm elements do render, just not in time)

**Expected Counterexamples**:
- `querySelectorAll('.grid')` returns empty NodeList (length 0) on first execution
- Possible causes: query executes before async data loads, waitFor doesn't retry because no error is thrown, component hasn't rendered grid elements yet

### Fix Checking

**Goal**: Verify that for all test executions where the SkillsPage component is rendered with valid skills data, the fixed test successfully finds grid elements and passes.

**Pseudocode:**
```
FOR ALL testExecution WHERE componentRendered(testExecution) AND dataLoaded(testExecution) DO
  result := runFixedTest(testExecution)
  ASSERT testPasses(result) AND gridElementsFound(result)
END FOR
```

### Preservation Checking

**Goal**: Verify that for all other tests in the SkillsPage test suite, the fixed code produces the same test results as the original code.

**Pseudocode:**
```
FOR ALL test WHERE test != 'should render skills in a grid layout' DO
  ASSERT runTest_original(test) = runTest_fixed(test)
END FOR
```

**Testing Approach**: Property-based testing is not applicable here since we're fixing a test, not production code. Instead, we'll use regression testing to ensure all other tests continue to pass.

**Test Plan**: Run the full SkillsPage test suite on UNFIXED code (excluding the failing test) to establish baseline, then run the same suite after the fix to verify no regressions.

**Test Cases**:
1. **Certifications Grid Test**: Verify this test continues to pass with its current implementation
2. **All Other SkillsPage Tests**: Run the complete test suite and verify all tests pass
3. **Component Rendering**: Verify the SkillsPage component still renders correctly in the browser
4. **Tailwind Classes**: Verify grid elements still use Tailwind utility classes after the fix

### Unit Tests

- Test that the fixed test waits for skills data to load before querying for grid elements
- Test that the query successfully finds grid elements after data loads
- Test that the assertion passes when grid elements are found
- Test edge case where no skills data is returned (test should handle gracefully)

### Property-Based Tests

Not applicable for this bugfix as we're fixing a test file, not production code with complex input domains.

### Integration Tests

- Run the complete SkillsPage test suite to verify no regressions
- Verify the SkillsPage component renders correctly in the browser with grid layouts
- Test that both skills and certifications sections display in grid layouts
- Verify that the fix works across different viewport sizes (responsive grid classes)
