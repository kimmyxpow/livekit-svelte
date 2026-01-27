Use Bun instead of npm, pnpm, or yarn.
Always run bun check, bun lint, bun format when making any changes.

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

## Plan Mode

- Produce extremely concise plans.
- Prioritize concision over grammar or readability.
- Avoid explanations, prose, or filler.
- End every plan with a list titled **“Unresolved Questions”**.
- Include only questions that materially block execution.
- If no blockers exist, explicitly state **“Unresolved Questions: None.”**

## Code Style & Generation Rules

- Generate self-explanatory code.
- Do not use comments.
- Express intent through naming, structure, and composition only.
- Maintain strict consistency in:
  - File structure
  - Module boundaries
  - Naming conventions
  - Architectural patterns
- Always explore the existing project first to understand:
  - Current directory layout
  - Conventions
  - Abstractions
  - Dependency patterns
- Place new code only in logically correct locations based on the existing structure.
- Do not introduce new patterns unless strictly necessary.

## Skills

- **Skill(svelte-code-writer)**: MANDATORY for ALL Svelte component (.svelte) and module (.svelte.ts/.svelte.js) work. NEVER create or edit Svelte files without invoking this skill first. Execution within svelte-file-editor agent REQUIRED for optimal results. Violating this rule produces broken, non-compliant code.
