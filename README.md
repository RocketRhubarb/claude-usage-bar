# usage-bar

A Claude Code plugin that adds a slim usage readout to the right side of the prompt footer, the row that shows labels such as the permission mode:

```
ctx ███░░░░░░░ 31%  ·  5h █████░░░░░ 52%  ·  week ██░░░░░░░░ 17%
```

| Readout | Meaning |
| --- | --- |
| `ctx` | How full the context window is |
| `5h` | Usage of the five-hour session rate-limit window |
| `week` | Usage of the seven-day rate-limit window |

Bars are green below 70%, yellow from 70% and red from 90%. A figure Claude Code does not have yet shows as `–`. The `5h` and `week` figures come from the account's rate-limit windows, so they only appear on a Claude subscription, and only after the first response of a session has reported them.

The bar redraws whenever Claude Code reports a changed measurement. It reads figures through `$.session.usage()` and changes nothing else about your session.

## Install

At the prompt of a terminal session:

```
/plugin install usage-bar --marketplace RocketRhubarb/claude-usage-bar
```

From a shell:

```
claude plugin install usage-bar --marketplace RocketRhubarb/claude-usage-bar
```

Answer `y` to add the marketplace, then pick a scope. The bar is active from then on.

### Try it without installing

```
git clone https://github.com/RocketRhubarb/claude-usage-bar
claude --plugin-dir ./claude-usage-bar
```

## Files

- `hooks/register.tsx`: the whole plugin, a `ui.render` hook on the `SessionMode` footer slot plus a `session.measure` hook that triggers redraws.
- `types/index.d.ts`: the type contract for the plugin's state.

## License

MIT, see [LICENSE](LICENSE).
