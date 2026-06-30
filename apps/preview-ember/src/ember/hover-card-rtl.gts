import Component from '@glimmer/component';
import { Button } from '@/ember-ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/ember-ui/hover-card';

const physicalSides = [
  { side: 'left', label: 'يسار' },
  { side: 'top', label: 'أعلى' },
  { side: 'bottom', label: 'أسفل' },
  { side: 'right', label: 'يمين' },
] as const;

export default class HoverCardRtlDemo extends Component {
  sides = physicalSides;

  <template>
    <div class="flex flex-wrap justify-center gap-2">
      {{#each this.sides as |item|}}
        <HoverCard @openDelay={{10}} @closeDelay={{100}}>
          <HoverCardTrigger @asChild={{true}} as |trigger|>
            <Button @variant="outline" {{trigger.modifiers}}>{{item.label}}</Button>
          </HoverCardTrigger>
          <HoverCardContent @side={{item.side}} @class="flex w-64 flex-col gap-1" dir="rtl">
            <div class="font-semibold">سماعات لاسلكية</div>
            <div class="text-muted-foreground text-sm">٩٩.٩٩ $</div>
          </HoverCardContent>
        </HoverCard>
      {{/each}}
    </div>
  </template>
}
