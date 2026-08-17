# Spacetime Simulator

An interactive 3D spacetime curvature visualization built with JavaScript and Three.js.

The project visualizes gravity using the common "rubber sheet" analogy: celestial bodies deform a 3D spacetime mesh according to their mass and position.

> **Note:** This project is a visual and experimental simulator. The spacetime sheet is an analogy and should not be interpreted as a physically complete simulation of General Relativity.

---

## Features

- Interactive 3D spacetime grid
- Real-time curvature visualization
- Multiple celestial bodies
- Custom mass and radius values
- Custom object positioning
- Solar-system and stellar presets
- Black hole presets
- Adjustable simulation space size
- Interactive camera controls
- Object selection and movement
- Free mouse dragging
- Axis-based object movement
- Object deletion
- Copy and paste support
- Undo support
- English and Turkish interface
- Starfield background
- Two experimental curvature models

---

## Curvature Models

The simulator currently contains two different visualization approaches.

### Theory A — Global Y Deformation

Each object's gravitational influence deforms the spacetime mesh along the global vertical axis.

This corresponds to the conventional rubber-sheet visualization of gravity.

### Theory B — Surface-Normal Deformation

Deformation attempts to follow the local normal of the already-curved surface.

This mode is experimental and is intended to explore how additional masses could visually affect an already-deformed surface.

Neither model is intended to be a complete numerical implementation of Einstein's field equations.

---

## Celestial Bodies

Objects can be created manually or selected from predefined presets.

Examples include:

- Sun
- Mercury
- Venus
- Earth
- Moon
- Mars
- Jupiter
- Saturn
- Uranus
- Neptune
- Proxima Centauri
- Sirius A
- Polaris
- Betelgeuse
- White Dwarf
- Neutron Star
- Stellar Black Hole
- Intermediate-Mass Black Hole
- Sagittarius A*
- Supermassive Black Hole

Custom objects can also be created by specifying:

- Name
- Mass
- Radius
- X position
- Z position
- Color

---

## Units

Object properties are currently expressed primarily in solar units.

| Symbol | Meaning |
|---|---|
| `M☉` | Solar Mass |
| `R☉` | Solar Radius |

For example:

```text
Sun
Mass:   1 M☉
Radius: 1 R☉
```

These physical values are mapped to visualization scales internally so that objects with vastly different real-world sizes and masses can still be displayed within the same scene.

---

## Controls

### Camera

Use the mouse to orbit, pan and zoom around the simulation.

### Objects

Select a celestial body to manipulate it.

Supported interactions include:

```text
Mouse Drag        Move selected object freely
Transform Gizmo   Move along an axis
Delete            Delete selected object
Escape            Deselect object
Arrow Keys        Move selected object
Ctrl + C          Copy selected object
Ctrl + V          Paste object
Ctrl + Z          Undo
```

---

## Installation

### Requirements

- Node.js
- npm
- A modern WebGL-capable browser

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/spacetime-simulator.git
```

Enter the project directory:

```bash
cd spacetime-simulator
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display a local address, usually:

```text
http://localhost:5173/
```

Open it in your browser.

---

## Technology

The project is built using:

- JavaScript
- Three.js
- WebGL
- Vite
- HTML
- CSS

---

## Project Structure

```text
spacetime-simulator/
│
├── public/
│
├── src/
│   ├── bodies/
│   │   ├── BodyPresets.js
│   │   ├── CelestialBody.js
│   │   └── ...
│   │
│   ├── scene/
│   │   ├── SceneManager.js
│   │   ├── Camera.js
│   │   └── ...
│   │
│   ├── ui/
│   │   ├── BodyCreator.js
│   │   ├── ObjectList.js
│   │   ├── LeftPanel.js
│   │   ├── SpaceSettings.js
│   │   ├── TheorySelector.js
│   │   ├── LanguageSelector.js
│   │   └── LanguageManager.js
│   │
│   ├── main.js
│   └── style.css
│
├── index.html
├── package.json
└── README.md
```

The simulator is separated into independent modules for scene management, celestial bodies, spacetime deformation, interaction and UI.

---

## Current Status

The project is under active development.

Current work focuses on:

- Improving curvature calculations
- Improving multi-body interactions
- Refining surface-normal deformation
- Better object manipulation
- Improving visualization at extreme mass scales
- Expanding celestial-body presets
- Improving UI and simulation controls

---

## Future Ideas

Possible future additions include:

- Orbital motion
- Velocity vectors
- N-body gravitational simulation
- Time controls
- Pause / resume / simulation speed
- Collision handling
- Object trails
- Orbit prediction
- Lagrange point visualization
- Gravitational field vectors
- Gravitational potential visualization
- Schwarzschild radius visualization
- Event horizons
- Accretion disks
- Gravitational lensing
- Save/load simulation scenes
- Additional curvature models
- More physically accurate General Relativity approximations

---

## Disclaimer

This simulator is primarily an educational and visualization project.

The 3D sheet representation of spacetime is a simplified analogy. Real spacetime in General Relativity is four-dimensional and its curvature is described by Einstein's field equations.

Therefore, the deformation shown by this project should not be interpreted as a literal representation of physical spacetime.

---

## License

No license has currently been specified.