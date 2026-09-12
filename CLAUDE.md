# @ngsignal/mutation Demo

This project is the Angular demo application for `@ngsignal/mutation`.

The purpose of this application is to help Angular developers understand
the library through clear, interactive and realistic examples.

The demo is educational first. It should make the library easy to understand,
not demonstrate unnecessary application architecture.

---

# 1. Source of Truth: CRITICAL

Before implementing, modifying or documenting any demo feature, ALWAYS read:

1. `README.md` of the project
2. The relevant source code of `@ngsignal/mutation`
3. Relevant tests when behavior is ambiguous

The current README and implementation are the source of truth.

Never rely on:

* prior knowledge of mutation libraries;
* assumptions about Angular mutation APIs;
* behavior from other libraries;
* previous versions of `@ngsignal/mutation`;
* assumptions about what a mutation library "should" provide;
* inferred or imagined features.

## Feature rule

Only demonstrate features that are actually supported by the current
version of `@ngsignal/mutation`.

Before creating a demo for a feature:

1. Verify that the API exists.
2. Verify how it actually behaves.
3. Verify the behavior against the source/tests when necessary.
4. Only then design the example.

If a feature is not present in the current library, do not add it to the demo.

Do not simulate a missing library feature and present it as if it were
provided by `@ngsignal/mutation`.

If an application-level pattern is demonstrated, clearly distinguish it
from functionality provided by the library.

---

# 2. Do Not Invent Features

This rule has priority over all other instructions.

Do not invent or assume:

* APIs
* options
* callbacks
* mutation states
* cancellation behavior
* concurrency behavior
* caching
* retry
* optimistic updates
* resource invalidation
* synchronization mechanisms
* Angular integrations
* configuration options

The demo must reflect the actual library.

If unsure about a behavior, inspect the implementation instead of guessing.

---

# 3. Demo Goal

The application should allow a developer to answer:

* What problem does `@ngsignal/mutation` solve?
* How do I create a mutation?
* How do I execute it?
* What state does it expose?
* How do I handle success?
* How do I handle errors?
* How do I use the returned value?
* How do I reset a mutation?
* How does it integrate with Angular?
* What are the important semantics and edge cases?

The answers must come from the actual library.

---

# 4. Educational Principles

## Show, don't hide

Prefer small, executable examples over large explanations.

The developer should be able to see:

```text
User action
    ↓
mutation.mutate(...)
    ↓
mutationFn(...)
    ↓
Mutation state
    ↓
Angular UI
```

The relationship between the UI and the library API should remain obvious.

## Keep examples explicit

Demo code should prioritize readability and pedagogy.

Do not introduce abstractions simply to avoid a few repeated lines.

It is acceptable to duplicate small amounts of code when this makes the
library API easier to understand.

Avoid:

* unnecessary services;
* excessive factories;
* generic wrappers;
* complex state-management abstractions;
* architecture that hides the API being demonstrated.

---

# 5. Angular

Use modern Angular practices.

Prefer:

* standalone components;
* Signals;
* `inject()`;
* modern Angular control flow;
* strong TypeScript typing;
* semantic HTML.

Do not introduce another state-management library.

The purpose of the application is to demonstrate `@ngsignal/mutation`.

Use Angular features only when they help demonstrate the library or create
a coherent demo application.

---

# 6. Library API

Do not hard-code an assumed API into this file.

The exact public API must always be obtained from the current README and
implementation.

When writing examples, use the actual API exposed by the installed version.

If the library evolves, update the demo according to the new README and
implementation rather than preserving outdated assumptions.

---

# 7. Interactive Demonstrations

Examples should preferably be interactive.

A developer should be able to trigger an operation and observe its behavior.

Use deterministic mock/local behavior where possible.

Avoid depending on:

* API keys;
* authentication;
* unreliable external APIs;
* external services that can randomly fail.

Artificial delays are acceptable when necessary to make asynchronous
behavior visible.

If a delay is artificial, make that clear in the example.

---

# 8. Mutation State

When the library exposes observable state, make that state visible in the UI.

The UI should help developers understand transitions and outcomes.

Do not duplicate library state unnecessarily.

For example, if the library exposes a loading/pending state, use that state
rather than creating a second unrelated `isLoading` signal.

Always use the actual state semantics defined by the current library.

---

# 9. Errors

Error demonstrations should be deterministic.

Provide a clear way for the developer to trigger an error when demonstrating
error handling.

Do not rely on random network failures.

The UI should display useful error information rather than only logging errors
to the console.

---

# 10. Concurrent / Asynchronous Behavior

If the current library has specific semantics for multiple mutations,
concurrency, stale results, cancellation, promises, or abort signals,
those semantics must be demonstrated accurately.

Do not infer the behavior.

Before creating such a demo:

1. Read the README.
2. Inspect the implementation.
3. Inspect tests if necessary.
4. Reproduce the actual behavior in the demo.

Terminology matters.

Do not call something "cancellation" unless the library actually cancels
the operation.

Do not call something "concurrency control" unless that accurately describes
the implementation.

---

# 11. API Visibility

The actual library API should remain visible in the examples.

Avoid hiding the important part inside abstractions.

A developer reading the example should quickly identify:

* where the mutation is created;
* where its mutation function is defined;
* where it is executed;
* where its state is consumed.

The code displayed by the demo should closely correspond to the code actually
executed.

Do not create fake snippets that substantially differ from the implementation.

---

# 12. UX / UI

The UI should be minimal, coherent and professional.

The goal is not to build a complex SaaS dashboard.

Prioritize:

* clarity;
* readability;
* hierarchy;
* consistent spacing;
* obvious actions;
* clear status information;
* accessibility;
* responsive behavior.

Avoid:

* excessive animations;
* unnecessary gradients;
* excessive shadows;
* decorative elements without purpose;
* unnecessary modals;
* complicated navigation;
* visual noise.

The interface should feel like a polished developer documentation/demo site.

---

# 13. Navigation

Group demo entries by release status rather than listing them all flat.

Put released features together, and others after the last tag together as
well, with a clear indicator "what's next ?"

---

# 14. Demo Layout

A demo can generally follow this structure:

```text
Title
Short explanation

┌──────────────────────────────────────┐
│ Interactive example                  │
│                                      │
│ [ Action ]                           │
│                                      │
│ Current state                        │
│ Result / Error                       │
└──────────────────────────────────────┘

How it works

Relevant code
```

Keep the structure consistent across examples.

Do not force every example into exactly the same layout if doing so makes
the concept harder to understand.

---

# 15. Code Examples

Code is part of the documentation.

Examples should be:

* short;
* readable;
* idiomatic Angular;
* strongly typed;
* representative of real usage.

Prefer showing the smallest code necessary to demonstrate the concept.

Do not optimize demo code for maximum abstraction or maximum DRYness.

The reader should be able to copy the core pattern into an Angular project
and understand what it does.

---

# 16. Accessibility

Follow basic accessibility principles:

* semantic HTML;
* keyboard-accessible controls;
* visible focus states;
* meaningful labels;
* sufficient contrast;
* accessible status information.

Do not communicate important state exclusively through color or animation.

---

# 17. Responsive Design

The demo should work on:

* desktop;
* tablet;
* mobile.

Code blocks may scroll horizontally on small screens when necessary.

Do not sacrifice readability to force code into a narrow layout.

---

# 18. Dependencies

Keep dependencies minimal.

Before adding a dependency, ask:

1. Is it necessary?
2. Does Angular already provide the functionality?
3. Does it help demonstrate the library?
4. Does it add unnecessary bundle size or complexity?

Do not add a large UI framework solely to make the demo look polished.

---

# 19. Performance

The demo itself does not need to be an extreme performance benchmark.

However:

* avoid unnecessary subscriptions;
* avoid duplicated state;
* avoid unnecessary rendering work;
* avoid unnecessary dependencies;
* avoid expensive operations in templates.

Do not sacrifice educational clarity for premature optimization.

---

# 20. Testing

Test behavior that is important to the demonstration.

Prioritize:

* initial state;
* successful operations;
* error behavior;
* pending/asynchronous behavior;
* reset behavior;
* important edge cases;
* behavior specifically documented by the library.

Tests should validate observable behavior rather than implementation details.

When a demo illustrates subtle library semantics, tests are particularly
valuable because they prevent the demo from silently becoming inaccurate
when the library evolves.

---

# 21. Documentation

The demo complements the README; it does not replace it.

The README answers:

> "What is the API and how does the library work?"

The demo should answer:

> "Show me what that looks like in a real Angular application."

Avoid duplicating large amounts of documentation.

Link or reference the relevant README documentation when useful.

---

# 22. Changes to the Library

If implementing a demo reveals that the README appears inconsistent with the
current implementation:

Do not silently invent an interpretation.

Instead:

1. inspect the source;
2. inspect tests;
3. identify the discrepancy;
4. make the smallest change necessary;
5. update documentation if the task explicitly includes documentation.

The demo must never become the source of truth for library behavior.

---

# 23. Decision Rule

For every proposed feature or change, ask:

> Does this help developers understand an actual capability, API or behavior
> of the current `@ngsignal/mutation` implementation?

If yes, implement it simply and clearly.

If no, do not add it.

When in doubt, read the README and source code again.

The demo should teach the real library, not an imagined version of it.
