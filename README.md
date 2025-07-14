# Obsidian MD - Kenku FM Intergration
This plugins give the ability to control Kenku FM from obsidian notes using the Remote API

## Features

### Basic Track Card
![example of basic track card](https://github.com/natowb/obsidian-kenkufm/blob/main/assets/basic_track_card.png?raw=true)
````yaml
```kenkufm-track
   id: f664fc30-5392-47ce-ab67-d6f50fdc9b57
```
````

### Progress Track Card
![example of progress track card](https://github.com/natowb/obsidian-kenkufm/blob/main/assets/progress_track_card.png?raw=true)
````yaml
```kenkufm-track
   id: f664fc30-5392-47ce-ab67-d6f50fdc9b57
   showProgress: true
```
````


## Contributing

If you encounter any issues or have suggestions for improvements, feel free to
open an issue or submit a pull request. Contributions are welcome!

### Development

Before you get started, ensure that you have the following software installed:
- [node.js](https://nodejs.org) (v14 or above)
- [bun.sh](https://bun.sh/) (way better than any other node package managers)

```bash
bun install
```

1. Start the development server with hot-reloading using the following command:

```bash
bun dev
```

2. In **Obsidian**, open **Settings**.
3. In the side menu, select **Community plugins**.
4. Select **Turn on community plugins**.
5. Under **Installed plugins**, enable the **Kenku FM Intergration** by
   selecting the toggle button next to it.

#### Commits
we follow https://conventionalcommits.org/ format for commit messages
```md
type(scope?): subject  #scope is optional; multiple scopes are supported (current delimiter options: "/", "\" and ",")
```

#### Source mapping
To get the source map to load in Obsidian, and thus allowing you to see your Typescript code when debugging, you might need to set the 
**sourcemapBaseUrl** parameter in **vite.config.ts**. To actual path can be found by adding the folder (test-vault) containing your .map file to the "Filesystem" 
tab in the debugger. Right-click the map file and select "Copy link address". Set **sourcemapBaseUrl** to the base address.

#### Resources

Here are some resources to help you get started with building plugins for
Obsidian, Svelte, and Tailwind CSS (UnoCSS):

- [Obsidian Plugin API Documentation](https://github.com/obsidianmd/obsidian-api)
- [Svelte Documentation](https://svelte.dev/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [UnoCSS Documentation](https://unocss.dev/)
