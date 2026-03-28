export interface Article {
  slug: string
  num: string
  title: string
  tag: string
  date: string
  readTime: string
  intro: string
  sections: { heading?: string; body: string }[]
}

export const ARTICLES: Article[] = [
  {
    slug: 'fed-impossible-dilemma',
    num: '#041',
    title: "The Fed's Impossible Dilemma: Growth vs. Inflation in 2026",
    tag: 'Economics',
    date: 'March 24, 2026',
    readTime: '5 min read',
    intro: "The Federal Reserve spent 2022 and 2023 raising rates aggressively to kill inflation. Now it faces a much harder problem: inflation is still above target, but the economy is visibly slowing. There's no clean path forward — and markets haven't fully priced in what that means.",
    sections: [
      {
        heading: 'The situation, plainly stated',
        body: "Inflation in February 2026 came in at 3.1% — still above the Fed's 2% target, and stubbornly so. Meanwhile, job growth slowed to 82,000 in February, the weakest reading since mid-2023. Consumer confidence has fallen for four consecutive months. The economy isn't in recession, but it's clearly losing altitude.\n\nThis is the worst position for a central bank to be in. Cut rates too soon and inflation re-accelerates. Keep rates high and you risk tipping the economy into a contraction you helped engineer. The Fed is effectively trying to thread a needle while wearing oven mitts."
      },
      {
        heading: 'Why this time is different',
        body: "What makes 2026 unusual is the inflation mix. Unlike 2022, which was driven largely by goods prices (supply chains, energy, cars), the inflation that remains is almost entirely services-based — housing costs, insurance, healthcare, and wages in labor-intensive sectors.\n\nServices inflation is historically sticky. It doesn't respond quickly to rate hikes because it's driven by wage expectations, not supply disruptions. The Fed's blunt instrument — the overnight lending rate — is a poor tool for this kind of problem. You can make mortgages more expensive, but that doesn't make hospital bills cheaper."
      },
      {
        heading: 'What the Fed is actually likely to do',
        body: "Fed Chair commentary has shifted subtly over the past two meetings. The phrase 'data dependent' is being used more, which is Fed-speak for 'we're not sure what to do next.' The dot plot — the Fed's own projection of where rates will be — showed three cuts penciled in for 2026 back in December. Most analysts now think it'll be one, maybe two, and probably not until Q3.\n\nThe bigger risk isn't the timing of cuts. It's that the Fed pauses too long, the labor market deteriorates faster than expected, and they're forced into emergency cuts — which spook markets more than gradual ones."
      },
      {
        heading: 'What to watch',
        body: "Two numbers matter most right now: the March PCE (Personal Consumption Expenditures) report, which is the Fed's preferred inflation gauge, due April 28th, and Q1 GDP, out the same week. If both come in soft, expect rate-cut bets to surge. If PCE is sticky while GDP disappoints, you'll see real volatility — because that's the stagflation scenario nobody wants to talk about but everyone is quietly modeling.\n\nFor now: the Fed is frozen. And frozen central banks tend to move suddenly when they finally do move."
      },
    ],
  },
  {
    slug: 'gpt5-arms-race',
    num: '#040',
    title: 'GPT-5 and the Arms Race Nobody Is Talking About',
    tag: 'AI',
    date: 'March 17, 2026',
    readTime: '6 min read',
    intro: "GPT-5 launched quietly last month with benchmarks that set new records across every standard evaluation. The coverage focused on capabilities. What it missed was more important: the economics of the AI race have fundamentally shifted, and the companies that don't understand that are already losing.",
    sections: [
      {
        heading: 'The benchmark arms race is a distraction',
        body: "Every major lab is publishing models that claim to top the leaderboards. GPT-5 beats Claude on coding. Claude beats GPT-5 on reasoning. Gemini Ultra claims the crown on multimodal tasks. Grok 3 is somehow good at finance.\n\nHere's the thing: users can't feel the difference between models that score 87% vs 91% on MMLU. What they can feel is latency, cost, and whether the product they're using actually works. The benchmark war is being fought for press coverage and investor confidence — not for actual user preference."
      },
      {
        heading: 'The real race: inference economics',
        body: "The competition that actually determines who wins is happening at the infrastructure layer, and it's brutal. Serving a frontier model at scale costs an extraordinary amount of money. The labs are racing to drive inference costs to near zero — because the moment that happens, whoever reaches it first can undercut everyone else and buy the market.\n\nOpenAI, Google, and Anthropic are all burning through capital at rates that would be alarming in any other industry. The question isn't who has the best model. It's who can survive long enough to make running their model economically viable."
      },
      {
        heading: 'The open-source wildcard',
        body: "While the big labs compete on the frontier, the open-source ecosystem is closing the gap faster than anyone expected. Meta's Llama series, Mistral's models, and a growing number of fine-tuned variants are now genuinely competitive with GPT-3.5-level performance — and they cost essentially nothing to run if you have hardware.\n\nFor enterprise customers, this creates a real alternative. Why pay per token to OpenAI if you can fine-tune an open model on your own data and run it in your own cloud? The labs are well aware of this threat. It's one reason why every major frontier model now comes with a serious API pricing reduction every six months."
      },
      {
        heading: 'What actually happens next',
        body: "The AI arms race ends when consolidation begins — and consolidation is coming. There are currently more than 40 companies with meaningful AI lab operations. In five years, there will probably be five or six. The ones that survive will be those with the deepest distribution (Microsoft, Google), the clearest enterprise relationships (Anthropic, with its AWS and Google deals), or the most defensible open-source communities (Meta).\n\nGPT-5 is impressive. But the model that matters is whichever one is still being used when the music stops."
      },
    ],
  },
  {
    slug: 'recession-predictions-wrong',
    num: '#039',
    title: 'Why Every Recession Prediction Has Been Wrong (So Far)',
    tag: 'Markets',
    date: 'March 10, 2026',
    readTime: '5 min read',
    intro: "In 2022, economists predicted a recession by end of 2023. In 2023, they moved the forecast to 2024. In 2024, the consensus said Q1 2025. We're now in early 2026, and the US economy is still growing, employment is near historic highs, and consumer spending hasn't collapsed. What keeps getting it wrong?",
    sections: [
      {
        heading: 'The inverted yield curve problem',
        body: "The most cited recession predictor for the past three years has been the inverted yield curve — when short-term Treasury yields exceed long-term ones. It predicted every recession since 1970 with no false positives. Then it inverted in 2022, stayed inverted for the longest stretch on record, and... nothing happened.\n\nThis doesn't mean the indicator is broken. It means the lag is longer and more variable than the historical average suggested. It also means that when you have 40 years of data and one extreme outlier (a global pandemic followed by an enormous fiscal stimulus), your models may not be telling you what you think they're telling you."
      },
      {
        heading: 'The labor market that refuses to break',
        body: "Every recession model has some version of unemployment as a central input. The theory: when rates rise, companies stop hiring. When they stop hiring, consumers cut spending. When consumers cut spending, the economy contracts.\n\nWhat the models didn't account for was a labor market permanently altered by COVID. The labor force participation rate for prime-age workers is at a 20-year high. Companies that went through the brutal experience of hiring in 2021-2022 have been extremely reluctant to lay off workers — because they know how hard it is to get them back. This 'labor hoarding' behavior has kept unemployment low in conditions that would historically have caused it to rise significantly."
      },
      {
        heading: 'The fiscal elephant in the room',
        body: "Government spending has been quietly doing a lot of work. The CHIPS Act, the Inflation Reduction Act, and ongoing defense spending have injected hundreds of billions of dollars into specific sectors — semiconductors, clean energy, defense manufacturing — that are running at full capacity while other parts of the economy slow.\n\nThis is unusual. In previous rate-hiking cycles, fiscal policy wasn't actively fighting monetary policy. The Fed raised rates and the government wasn't simultaneously spending at wartime levels. The result is an economy that's slowing but not collapsing, which makes every recession call look wrong six months out."
      },
      {
        heading: 'So when does it happen?',
        body: "Maybe it doesn't — not in the traditional sense. What's increasingly likely is a rolling slowdown that hits different sectors at different times rather than a synchronized contraction that shows up cleanly in the GDP numbers. Real estate is already in recession. Trucking went through one last year. Consumer discretionary spending is weak. But tech employment recovered, manufacturing is strong, and healthcare never slows down.\n\nThe forecasters who've been calling recession keep being right about the weakness and wrong about the timing. That's not a forecasting failure. It's a sign that the economy is more complex and more segmented than the models assume."
      },
    ],
  },
  {
    slug: 'ai-takeover-white-collar',
    num: '#038',
    title: 'The Quiet AI Takeover of White-Collar Work',
    tag: 'AI',
    date: 'March 3, 2026',
    readTime: '6 min read',
    intro: "Nobody announced it. There was no press release. But over the past 18 months, a structural shift has happened in how large companies operate their knowledge-work functions — and most people who work in those functions haven't fully processed what's coming.",
    sections: [
      {
        heading: "What's actually happening, right now",
        body: "Walk into any major consulting firm, law firm, financial institution, or tech company today and you'll find the same pattern: AI tools doing the first draft of almost everything. Legal briefs, financial models, market research, code, presentations, emails, reports — the junior work that used to take teams of entry-level analysts weeks to produce is now generated in hours.\n\nThis hasn't caused mass layoffs yet — at least not explicitly AI-related ones. What it's caused is a near-freeze on hiring in those roles. Goldman Sachs, which would have hired 250 analysts in its investment banking division five years ago, hired 150 last year. McKinsey's associate class is smaller. Law firms are extending contracts rather than making permanent offers. The work is getting done with fewer people, and those people are being asked to do more."
      },
      {
        heading: 'The productivity paradox',
        body: "Here's the strange part: productivity metrics don't fully show this yet. GDP per hour worked has improved, but not dramatically. Why?\n\nBecause the time savings from AI are often being absorbed by expanded scope, not reduced headcount. A lawyer who used to review 50 documents a week now reviews 200. A financial analyst who used to build two models now builds eight. The output per person has increased, but the price clients pay has also dropped — because clients know the work is being done faster and expect to pay less for it.\n\nThis is the productivity paradox: AI is making people dramatically more capable without that capability translating cleanly into wage or profit gains. The efficiency is real, but it's being competed away in real time."
      },
      {
        heading: 'Who actually loses',
        body: "The jobs most at risk are not the ones people assume. Senior partners, creative directors, and experienced engineers are doing fine — AI makes their judgment more valuable, not less. The jobs disappearing are the middle-rung, execution-heavy roles: the analyst who ran the same Excel model every month, the paralegal who summarized deposition transcripts, the junior developer who wrote boilerplate code.\n\nThese were the on-ramp roles — the jobs people did for two or three years to learn before moving up. If those jobs don't exist, the pipeline of experienced professionals starts to thin out in about five years. Nobody has a good answer for what replaces that learning pathway."
      },
      {
        heading: 'The adjustment that has to happen',
        body: "Every major technological displacement in history — mechanized farming, industrial manufacturing, computerized finance — caused short-term disruption and long-term productivity gains. The gains were real. But so was the disruption, and it landed on specific people in specific places, not evenly across the economy.\n\nAI is different in one important way: it's moving faster than previous transitions, and it's hitting multiple white-collar industries simultaneously rather than sequentially. The adjustment period is going to be shorter and more compressed — which makes it harder for education systems, hiring pipelines, and individuals to adapt. That's the part that should concern us more than the capability benchmarks."
      },
    ],
  },
  {
    slug: 'deglobalization-myth-megatrend',
    num: '#037',
    title: 'Deglobalization: Myth or Megatrend?',
    tag: 'Global',
    date: 'February 24, 2026',
    readTime: '5 min read',
    intro: "Since 2018, every major geopolitical event has been accompanied by declarations that globalization is over. COVID broke supply chains. The US-China trade war rewired manufacturing. Russia's invasion of Ukraine proved that economic interdependence doesn't prevent conflict. But the data tells a more complicated story.",
    sections: [
      {
        heading: "The case for deglobalization",
        body: "The evidence isn't nothing. Global trade as a percentage of GDP peaked around 2008 and has been flat to slightly declining since. Foreign direct investment flows dropped significantly after COVID and haven't fully recovered. The US has passed three major pieces of industrial policy legislation in four years specifically designed to bring manufacturing home or redirect it to allies.\n\nChina's share of US imports has fallen from 21% in 2017 to around 13% today. That's a significant reshuffling of trade flows — not a rounding error. Companies from Apple to Nike have visibly diversified their supply chains into Vietnam, India, and Mexico. 'China plus one' went from a consulting buzzword to standard corporate strategy."
      },
      {
        heading: 'The case against',
        body: "Here's what the deglobalization narrative misses: trade didn't decline, it redirected. US imports from Vietnam, India, and Mexico have all surged. Global shipping volumes are at near-record highs. The total volume of goods crossing borders is larger than it was in 2018 — it just crosses different borders.\n\nFinancial globalization is also deeper than ever. Capital moves across borders almost instantly. A rate decision in the US reverberates through emerging market currencies within hours. The largest companies in the world are still global enterprises — they just have more complex supply chains than they used to.\n\nWhat's happened isn't deglobalization. It's a reorganization of global trade around geopolitical blocs. That's genuinely different from what came before, but it's not the same as the world fragmenting into self-contained economic islands."
      },
      {
        heading: "The friend-shoring reality",
        body: "The emerging framework is what economists call 'friend-shoring' — moving supply chains not back home, but to geopolitically aligned countries. The US-Mexico-Canada Agreement is facilitating an enormous amount of manufacturing that used to happen in China. India is positioning itself aggressively for both manufacturing and services. The Gulf states are building industrial bases to capture flows that used to go elsewhere.\n\nThis creates real winners and losers. Mexico's manufacturing sector is in the middle of a historic boom. Parts of Southeast Asia are thriving. But countries that were tightly integrated with China and don't have natural alignments with the US-led bloc — think some Central Asian and African nations — are caught in an awkward middle."
      },
      {
        heading: 'What this means for investors and businesses',
        body: "Stop thinking about globalization as a binary. The question isn't whether the world is deglobalizing — it's which flows are shifting and toward where. Supply chain decisions that made sense in 2015 don't make sense in 2026. Regulatory risk in certain markets has become structural, not cyclical.\n\nThe megatrend is real, but it's more nuanced than the headlines suggest. The world isn't closing. It's reorganizing. And the companies and countries that understand the new map early will be the ones that look smart five years from now."
      },
    ],
  },
]

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug)
}
