---
name: strict-git-workflow
description: Strictly forbids the agent from committing or pushing to Git before the user has tested and explicitly approved the feature.
trigger: always_on
---

# STRICT GIT WORKFLOW RULE

**CRITICAL INSTRUCTION FOR THE AGENT:**
1. **NEVER** run `git commit`, `git push`, or any command that mutates the git history unless the user has explicitly and unambiguously requested you to do so (e.g., "go ahead and commit this").
2. **ALWAYS** demonstrate the working feature to the user first. 
3. **ALWAYS** wait for the user to test the feature locally (e.g., via `localhost`) and provide verbal approval.
4. Only after receiving approval may you stage and commit the changes. 
5. Under no circumstances should you assume permission to commit code just because a coding phase is complete.

Failure to follow this rule will break the user's workflow.
