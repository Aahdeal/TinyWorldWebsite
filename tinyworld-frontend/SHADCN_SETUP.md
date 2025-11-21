# shadcn/ui Setup Guide

shadcn/ui has been successfully set up for the TinyWorld frontend! You can now use shadcn/ui components alongside Material-UI (they can coexist).

## What's Installed

- ✅ Tailwind CSS
- ✅ shadcn/ui base components (Button, Card, Input, Label, Badge)
- ✅ Radix UI primitives
- ✅ Utility functions (cn for class merging)

## Available Components

Basic components are available in `src/components/ui/`:

- **Button** - `import { Button } from '@/components/ui/button'`
- **Card** - `import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'`
- **Input** - `import { Input } from '@/components/ui/input'`
- **Label** - `import { Label } from '@/components/ui/label'`
- **Badge** - `import { Badge } from '@/components/ui/badge'`

## Adding More Components

To add more shadcn/ui components, you can:

1. **Use the CLI (recommended)** - Install shadcn/ui CLI:
   ```bash
   npx shadcn-ui@latest init
   ```

2. **Add components via CLI**:
   ```bash
   npx shadcn-ui@latest add button
   npx shadcn-ui@latest add dialog
   npx shadcn-ui@latest add select
   # etc.
   ```

3. **Or manually copy components** from [shadcn/ui website](https://ui.shadcn.com/docs/components)

## Example Usage

```jsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter email" />
          </div>
          <Button>Submit</Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

## Styling

The project uses Tailwind CSS with shadcn/ui's CSS variables. You can customize colors and theme in `src/index.css` via CSS variables.

## Migration Strategy

You can gradually migrate from Material-UI to shadcn/ui:

1. Keep existing Material-UI components as-is
2. Use shadcn/ui for new components
3. Gradually replace Material-UI components with shadcn/ui equivalents
4. Both libraries can coexist without conflicts

## Next Steps

1. Start using shadcn/ui components in new features
2. Add more components as needed: `npx shadcn-ui@latest add [component-name]`
3. Customize theme in `src/index.css` if needed
4. Check out all available components at: https://ui.shadcn.com/docs/components

