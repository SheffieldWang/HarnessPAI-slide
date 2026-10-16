globalThis.HARNESS_SLIDES = Object.freeze([
  {
    title: 'HarnessPAI',
    section: 'THE RESEARCH',
    scene: 'cover',
    time: 2.6,
    animation: { start: 0, end: 7.4 },
    summary: 'An Evolving Harness for Physical AI — Xiaomi, Darwin Agent Team, and contributors from twelve institutions.',
    description: 'Title cover with the original Xiaomi logo and the twelve institution logos, each paired with its English name.'
  },
  {
    title: 'Intelligence beyond the model',
    section: 'THE QUESTION',
    scene: 'hero',
    time: 11.5,
    animation: { start: 8.6, end: 16.4 },
    summary: 'Physical intelligence requires perception, reasoning, action, and verification — not just a stronger action model.',
    description: 'A conceptual robot arm illustrates the action model as one component of a larger physical intelligence system.'
  },
  {
    title: 'Code as the executable harness',
    section: 'THE HARNESS',
    scene: 'harness',
    time: 24.3,
    animation: { start: 17.6, end: 27.4 },
    summary: 'Executable code connects perception, geometric reasoning, action primitives, and outcome checks.',
    description: 'Four pseudocode rows show PERCEIVE, REASON, ACT, and VERIFY, alongside VLA, WAM, PPO, and raw API primitives.'
  },
  {
    title: 'Within a rollout: execute and check',
    section: 'FIXED-PROGRAM EXECUTION',
    scene: 'evolution',
    time: 32.6,
    animation: { start: 28.6, end: 33.4 },
    summary: 'The program stays fixed within a rollout; perception and verification remain active during execution.',
    description: 'The upper execution lane highlights Perceive → Reason → Act → Verify. There are no online high-level LLM calls on the execution path.'
  },
  {
    title: 'Across rollouts: evolve the code',
    section: 'FEEDBACK-DRIVEN EVOLUTION',
    scene: 'evolution',
    time: 38.3,
    animation: { start: 33.5, end: 38.6 },
    summary: 'Between rollouts, feedback drives diagnosis, code repair, validation, and retention of improved programs.',
    description: 'The lower feedback loop highlights Run episodes → Diagnose → Revise code → Validate, ending with validated code v2.'
  },
  {
    title: 'Known tasks: reuse validated code',
    section: 'TASK MEMORY · HIT',
    scene: 'memory',
    time: 45.9,
    animation: { start: 44.5, end: 47.15 },
    summary: 'A task-memory hit loads a validated program from executable code memory instead of replanning.',
    description: 'For the example request “Place the mug in the bowl”, the green HIT branch leads to executable code memory and RUN VALIDATED CODE.'
  },
  {
    title: 'New tasks: retrieve, evolve, and save',
    section: 'TASK MEMORY · MISS',
    scene: 'memory',
    time: 49.4,
    animation: { start: 39.6, end: 44.45 },
    summary: 'A new task retrieves repair skills; successful evolution saves validated code, skills, and the task entry.',
    description: 'The MISS branch retrieves structured skill memory and evolves a program. Dashed return arrows save validated experience for later reuse.'
  },
  {
    title: 'The harness makes the difference',
    section: 'THE EVIDENCE',
    scene: 'results',
    time: 58,
    animation: { start: 50.6, end: 62.4 },
    summary: 'LIBERO-PRO: 34.9% → 96.5%. RoboCasa Atomic-Seen: 65.0% → 92.2%. No base-model retraining for these gains.',
    description: 'The paper reports +61.6 percentage points for pi-0.5 on LIBERO-PRO and +27.2 points for WorldDreamer on RoboCasa Atomic-Seen. LIBERO overall is 98.1%.'
  },
  {
    title: 'One interface, many embodiments',
    section: 'BEYOND ONE ROBOT',
    scene: 'embodiments',
    time: 67,
    animation: { start: 63.6, end: 72.4 },
    summary: 'The harness orchestrates action primitives across robot arms, household robots, vacuums, and walking agents.',
    description: 'Conceptual robot arm, vacuum, and walking-agent illustrations show model- and embodiment-agnostic orchestration, not experiment footage.'
  },
  {
    title: 'A second return: stronger models',
    section: 'HARNESS-COLLECTED DATA',
    scene: 'closing',
    time: 77.5,
    animation: { start: 73.6, end: 82.4 },
    summary: 'Fine-tuning pi-0.5 on harness-collected data reaches 73.7% on LIBERO-PRO — distinct from 96.5% harness execution.',
    description: 'A separate model-training result rises from 34.9% to 73.7%. This is not the 96.5% achieved by running the harness.'
  },
  {
    title: 'Three takeaways',
    section: 'WHAT TO REMEMBER',
    scene: 'takeaways',
    time: 89,
    animation: { start: 83.6, end: 94.4 },
    summary: 'Build better systems. Execute, check, and evolve. Make experience reusable.',
    description: 'Three cards remain visible while highlights cycle through connected perception and action, fixed execution with between-run evolution, and reusable skills plus training data.'
  }
]);
