# UI Components Rules

## ⚠️ Critical Rules

### shadcn/ui is the ONLY UI Component Library
**NEVER create custom UI components from scratch.** This application uses shadcn/ui exclusively for all UI elements. Do not:
- Create custom button, input, or form components
- Build UI primitives manually with Tailwind
- Install alternative component libraries (Material-UI, Ant Design, etc.)
- Write custom component logic that shadcn/ui already provides

## shadcn/ui Integration

### 1. Adding New Components
When you need a new UI element, **always** use the shadcn/ui CLI:

```bash
npx shadcn@latest add [component-name]
```

Examples:
```bash
npx shadcn@latest add button      # Add button component
npx shadcn@latest add input       # Add input component
npx shadcn@latest add card        # Add card component
npx shadcn@latest add dialog      # Add dialog/modal component
```

### 2. Component Location
All shadcn/ui components are installed in `components/ui/`:
- ✅ **DO NOT manually edit** files in `components/ui/`
- ✅ **DO** use these components as-is in your features
- ✅ **DO** compose complex UIs by combining shadcn/ui primitives

### 3. Usage Pattern
Import and use components directly:

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MyFeature() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text..." />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

## Available Components

Before creating any UI, check if shadcn/ui provides it:
- Forms: Input, Textarea, Select, Checkbox, Radio, Switch
- Buttons: Button, Toggle
- Layout: Card, Separator, Tabs, Accordion
- Overlays: Dialog, Sheet, Popover, Tooltip, Alert Dialog
- Feedback: Alert, Toast, Progress, Skeleton
- Navigation: Command, Navigation Menu, Breadcrumb
- Data Display: Table, Avatar, Badge, Calendar

📖 **Full component list**: https://ui.shadcn.com/docs/components

## Styling Custom Components

If you need to create a **feature-specific component** (not a UI primitive):
- ✅ **DO** compose it from shadcn/ui components
- ✅ **DO** use Tailwind CSS for styling
- ✅ **DO** use `cn()` utility from `lib/utils.ts` for className merging
- ❌ **DO NOT** create a new button/input/form variant from scratch

Example:
```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function FeatureCard({ className, ...props }) {
  return (
    <Card className={cn("p-6 shadow-lg", className)} {...props}>
      {/* Feature-specific content using shadcn/ui components */}
      <Button>Action</Button>
    </Card>
  );
}
```

## Icon Usage

This project uses **Lucide React** for icons:
```tsx
import { Download, Upload, Trash2 } from "lucide-react";

<Button>
  <Download className="mr-2 h-4 w-4" />
  Download
</Button>
```

📖 **Icon directory**: https://lucide.dev/icons
