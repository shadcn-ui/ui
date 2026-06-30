import Component from '@glimmer/component';
import { Button } from '@/ember-ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/ember-ui/hover-card';

const HOVER_CARD_SIDES = ['left', 'top', 'bottom', 'right'] as const;

export default class HoverCardSidesDemo extends Component {
  sides = HOVER_CARD_SIDES;

  <template>
    <div class="flex flex-wrap justify-center gap-2">
      {{#each this.sides as |side|}}
        <HoverCard @openDelay={{100}} @closeDelay={{100}}>
          <HoverCardTrigger @asChild={{true}} as |trigger|>
            <Button @variant="outline" class="capitalize" {{trigger.modifiers}}>{{side}}</Button>
          </HoverCardTrigger>
          <HoverCardContent @side={{side}}>
            <div class="flex flex-col gap-1">
              <h4 class="font-medium">Hover Card</h4>
              <p>This hover card appears on the {{side}} side of the trigger.</p>
            </div>
          </HoverCardContent>
        </HoverCard>
      {{/each}}
    </div>
  </template>
}
