// Editorial long-form: image-forward blog post (Unsplash photos at two aspect
// ratios), a pull quote, lists, and links. No code; the docs fixture owns that.
export const ARTICLE_HTML = `
<h1>A Morning at the Letterpress Museum</h1>
<p>The first thing you notice is the smell: machine oil, paper dust, and a century of ink that never fully dries. The second thing is the sound. A working letterpress shop is not quiet, and the museum on Greer Street keeps three presses working, because, as the docent told me within a minute of my arrival, <em>a silent press is just furniture</em>.</p>
<p>I went because I write software that arranges text on screens, and I had started to suspect that everything hard about my job had been solved a hundred years ago by people with steel tools and no undo. I left four hours later with ink on my sleeve and a notebook full of confirmations.</p>
<figure>
  <img class="grayscale dark:brightness-50" src="https://images.unsplash.com/photo-1629968417841-d87296c4205b?q=80&amp;w=1200&amp;h=675&amp;fit=crop" alt="Textured surface, worn by use." width="1200" height="675">
  <figcaption>Ink before it becomes language.</figcaption>
</figure>
<h2>The composing room</h2>
<p>Type lives in shallow wooden drawers called cases, and the layout of a case is itself a piece of interface design: the letters you reach for most sit nearest your hand, in the biggest compartments. Nobody alphabetized them. The arrangement was settled by frequency, argued over for a generation, and then never changed again, which is roughly the story of every good default I have ever shipped.</p>
<p>A compositor working at full speed sets about two thousand characters an hour, reading the manuscript with one eye while the other confirms each pick. The docent, a retired compositor named <strong>Ruth Okafor</strong>, demonstrated without looking down once. When I asked how long that took to learn she said, "The hands take a year. Knowing when a line is wrong takes ten."</p>
<blockquote>
  <p>Every em of space in this room is a physical object. You want more air between two lines, you go get the lead and you carry it back. It keeps your opinions about spacing very honest.</p>
</blockquote>
<p>That line rearranged something in my head. The strips of lead that printers wedged between lines of type are why we still say <a href="#">leading</a>. On my screen, spacing is a number I can change in a keystroke, and so I change it constantly, carelessly. Ruth's shop had exactly four widths of lead, and the whole trade agreed on them, and a hundred years of books came out beautiful anyway. Constraint was not the obstacle to the craft. It was the craft.</p>
<h2>What the metal knows</h2>
<figure>
  <img class="grayscale dark:brightness-50" src="https://images.unsplash.com/photo-1637325258040-d2f09636ecf6?q=80&amp;w=900&amp;h=1200&amp;fit=crop" alt="Recycled paper, up close." width="900" height="1200">
  <figcaption>Space is material.</figcaption>
</figure>
<p>Three things the metal insists on, which screens let us forget:</p>
<ul>
  <li><strong>Space is material.</strong> Word spaces, line leads, and margins are objects with widths. Nothing is "auto." Someone chose everything.</li>
  <li><strong>Hierarchy is expensive.</strong> Changing size means walking to a different case. Printers built emphasis from weight and space first because size was the costly move, and their pages read better for it.</li>
  <li><strong>The page is finished before it is printed.</strong> A locked-up chase either holds together or it doesn't. There is a satisfying finality to it that no deploy has ever given me.</li>
</ul>
<p>None of this is nostalgia, or not only. The constraints were real costs, and digital type was right to remove them. But removal has a second-order effect: when nothing is expensive, nothing forces a decision, and unforced decisions drift. The printers' defaults survived because changing them was work. Ours have to survive on discipline, which is a weaker material.</p>
<hr>
<h2>Field notes</h2>
<p>Practical things I wrote down, in the order I wrote them:</p>
<ol>
  <li>Ruth sets solid (no leading) only for lines shorter than the alphabet. Anything longer gets air. Our line-length rules agree, which pleased me more than it should have.</li>
  <li>The shop's "house style" fits on an index card taped inside a cabinet door. Four leads, two faces, three sizes. An entire design system, physically enumerable.</li>
  <li>Apprentices learn distribution (putting type away) before composition. You learn a system by returning things to it.</li>
</ol>
<p>The museum runs open studio on the first Saturday of every month, and they will let you set your own name if you ask. Mine came out crooked. Ruth looked at it for a moment and said it was a common beginner's error: I had been so careful choosing the letters that I forgot to check the spaces. I have been thinking about that all week.</p>
<p><em>The Greer Street Press Museum is open Thursday through Sunday. If you go, bring a jacket; the composing room is kept cold for the metal.</em></p>
`
