export interface Figure {
  kind: 'bars' | 'line' | 'stat'
  title: string
  caption: string
  unit?: string
  data: { label: string; value: number }[]
}

export interface Article {
  slug: string
  num: string
  title: string
  tag: string
  date: string
  readTime: string
  summary: string
  intro: string
  figure: Figure
  sections: { heading?: string; body: string }[]
}

export const ARTICLES: Article[] = [
  {
    slug: 'open-weights-versus-closed-labs',
    num: '#008',
    title: 'Open weights versus closed labs, as an economics question',
    tag: 'AI',
    date: 'June 22, 2026',
    readTime: '8 min read',
    summary: 'Free model weights are not free. Who pays to train them, who actually captures the value, and why both camps survive.',
    intro: "Every few months a lab releases a model anyone can download and run. Every few months a different lab argues that this is reckless, or unsustainable, or both. Strip out the safety debate and what is left is a pricing question, and pricing questions have answers.",
    figure: {
      kind: 'stat',
      title: "Nvidia's gross margin, fiscal 2026",
      caption: "GAAP gross margin on $215.9 billion of revenue, up 65% on the year, from Nvidia's fiscal 2026 results. The layer selling the hardware keeps the margin while the model labs compete each other down on price.",
      unit: '%',
      data: [{ label: 'GAAP gross margin, FY2026', value: 71.1 }],
    },
    sections: [
      {
        heading: 'What a weight file actually is',
        body: "A model's weights are a very large list of numbers. Once they exist, copying them costs nothing. That is the whole economic puzzle in one sentence. The thing that took an enormous amount of money to make can be duplicated for the price of bandwidth.\n\nClosed labs keep the file private and sell access by the token. Open-weight labs publish the file and make money somewhere else, or not yet at all. The phrase open source gets used loosely here. Most of these releases share the weights but not the training data or the full recipe, so you can run the model and fine-tune it, but you could not rebuild it from scratch."
      },
      {
        heading: 'Why a company would give away an expensive asset',
        body: "Meta is the clearest case. It does not sell model access. It sells advertising, and it wants AI features in its products to be cheap. If open weights push the whole industry's prices toward zero, Meta's costs fall and its competitors' revenue falls. Mark Zuckerberg has made roughly this argument on earnings calls, which is unusual candour for a strategy that hurts rivals.\n\nThe second reason is standards. Researchers want their work used. A model that runs on every university cluster becomes the default that people build tools around, and the lab that publishes it sets the conventions everyone else follows. Linux did this to commercial Unix. Android did it to the phone market.\n\nThe third reason is the one nobody puts in a press release. Publishing is the cheapest way to prove a claim when you are behind. DeepSeek's releases in early 2025 forced a rerun of every spreadsheet in the industry about what frontier AI costs to build."
      },
      {
        heading: 'What the closed labs are really selling',
        body: "If weights were the product, closed labs would be finished. They are not, and the reason is that the product is the running service. Uptime, latency, safety tuning, a support contract, a compliance certificate, and the guarantee that the model you tested in March still behaves the same way in September. Enterprises pay for that. Governments pay more for it.\n\nThere is also a capability gap, and how long it lasts is the open question. Open models have been trailing the best closed models by months rather than years, and the distance has been shrinking. For most tasks that gap is irrelevant. For the hardest ones, the tasks a bank or a drug company will pay top dollar for, it is the entire business.\n\nSo the honest picture is a price ladder. Free-to-run open models at the bottom, mid-priced closed APIs in the middle, and a thin expensive frontier at the top that gets rebuilt every year. Most of the volume ends up at the bottom. Most of the revenue stays near the top for a while."
      },
      {
        heading: 'Where the money is actually landing',
        body: "Follow the dollar and it does not stop at a lab. Nvidia reported $215.9 billion of revenue in fiscal 2026, up 65% in a year, at a GAAP gross margin of 71.1%. Data centre revenue in the fourth quarter alone was $62.3 billion, up 75%. The company selling the hardware is running the kind of margin that software companies envy, while the labs buying it are, by most public accounting, losing money on frontier models and hoping scale fixes it.\n\nThat is the part of this debate I would keep in view. Open versus closed decides who serves the tokens. It does not change who is collecting the cheque today.\n\nTwo things I would watch. Whether the price of a fixed capability level keeps falling at the pace it has, because if it does the middle rung of the ladder gets squeezed out entirely. And whether the open-closed gap on hard reasoning keeps narrowing, because if it closes to a couple of months the frontier stops being a moat and becomes a marketing expense."
      }
    ]
  },
  {
    slug: 'us-tariffs-cusma-review-ontario-manufacturing',
    num: '#007',
    title: 'The CUSMA review and what tariffs do to an Ontario factory',
    tag: 'Global',
    date: 'June 15, 2026',
    readTime: '9 min read',
    summary: "Three quarters of Ontario's exports go to one country. Here is what the 2026 CUSMA review means for the plants along the 401.",
    intro: "Most of what Ontario sells abroad goes to the United States, and a large share of it is cars, car parts, steel and aluminum. So when Washington talks about tariffs, it is not an abstract trade story here. It is a question about whether a plant in Oakville or Windsor or Hamilton runs a third shift next year.",
    figure: {
      kind: 'stat',
      title: "Ontario's merchandise exports going to the United States",
      caption: "Share of Ontario's goods exports by value in 2025, about CAD $237.6 billion of roughly $318 billion. The Financial Accountability Office of Ontario puts goods exports to the US at about 77% and services exports at about 60%.",
      unit: '%',
      data: [{ label: 'To the United States, 2025', value: 74.6 }],
    },
    sections: [
      {
        heading: 'How a car crosses the border several times',
        body: "The thing people miss about auto tariffs is that a car is not made in one country. An engine block cast in Ontario goes to Michigan for machining, back to Ontario for assembly, then to a plant in Ohio to go into a vehicle that is shipped to a dealer in Toronto. Industry associations have long said components can cross the border six or seven times before the finished car is sold.\n\nA tariff can be charged at each crossing. So a headline tariff rate is not the same as the cost increase on a car. Depending on how rules of origin are applied it can be more, and the paperwork alone is enough to make a plant manager want production consolidated on whichever side of the border avoids the crossing. That is the actual threat. Not the tax, but the incentive to consolidate, and the bigger market is not ours."
      },
      {
        heading: 'What the 2026 review is',
        body: "CUSMA, the agreement that replaced NAFTA in 2020, contains a clause requiring the three countries to sit down in 2026 and decide whether to extend it. If all three agree, it runs another sixteen years. If they do not, it moves to annual reviews, which is a polite way of saying permanent uncertainty.\n\nUncertainty has its own price. A company deciding where to put a battery plant or a stamping line wants to know the tariff rate for the next decade, not the next twelve months. When the answer is that it will be reviewed every year, the safe choice is to build in the biggest market. That is true even if the tariff never actually goes up. The threat does the work on its own."
      },
      {
        heading: 'What the record says versus what politicians claim',
        body: "The claim from Washington is that tariffs bring factories home. The evidence from the 2018 steel and aluminum tariffs is not kind to it. US steel production rose somewhat, and the price of steel for every US manufacturer that buys it rose too. Work from the Federal Reserve and from the Peterson Institute for International Economics found the tariffs cost more jobs in steel-using industries than they created in steel-making, at a cost per job saved that ran into the hundreds of thousands of dollars.\n\nOn the Canadian side, the claim is that we can diversify away from the American market. The number above says how far that has to go. Roughly three quarters of Ontario's goods exports have one destination, and the alternatives are an ocean away from a plant in Windsor. Diversification is a twenty-year project, not a policy announcement."
      },
      {
        heading: 'What a student in Richmond Hill should take from this',
        body: "If you are looking at business or engineering, the industries most exposed here are also the ones that hire the most co-op students in this province. Automotive, steel, plastics, machinery. None of them disappear, but the good jobs in them cluster around whichever plants win the consolidation fight.\n\nSo watch the review, and watch investment announcements more closely than statements. A plant expansion in Ontario means a company decided the tariff risk was survivable. A plant expansion in Kentucky that was rumoured for Ontario means the opposite. Those announcements tell you more about the next decade than any press conference will."
      }
    ]
  },
  {
    slug: 'gta-housing-supply-immigration-rates',
    num: '#006',
    title: 'Housing in the GTA: supply, immigration and rates, in that order',
    tag: 'Economics',
    date: 'June 8, 2026',
    readTime: '8 min read',
    summary: 'Prices are off their peak and almost nobody under 35 can still buy. A look at the three levers and which one actually moved.',
    intro: "Ask anyone in Toronto why housing costs what it costs and you get one of three answers: not enough building, too many people, or interest rates. All three are true. They are not equally true, and the order matters if you want to know what happens next.",
    figure: {
      kind: 'line',
      title: 'Average selling price, Toronto Regional Real Estate Board',
      caption: "Annual average selling price across all home types in the TRREB market area, from TRREB's year-end reports. The 2022 peak of about $1.19 million has given way to three softer years, ending 2025 at $1,067,968.",
      unit: 'CAD k',
      data: [
        { label: '2019', value: 819 },
        { label: '2020', value: 930 },
        { label: '2021', value: 1095 },
        { label: '2022', value: 1190 },
        { label: '2023', value: 1127 },
        { label: '2024', value: 1120 },
        { label: '2025', value: 1068 },
      ],
    },
    sections: [
      {
        heading: 'Supply: the long hole',
        body: "Ontario built fewer homes per person through the 2010s than it did in the 1970s, while the population grew faster. Canada Mortgage and Housing Corporation has estimated the country needs roughly three and a half million additional homes by 2030, on top of what would normally get built, to restore the affordability levels of the early 2000s. Ontario's share of that is the largest of any province.\n\nThe reason is not mysterious. In most of the GTA it takes years to get a permit, development charges on a new unit run well into the tens of thousands of dollars, and zoning across most residential land allows one house per lot. Every one of those is a municipal or provincial decision. None of them is a market outcome."
      },
      {
        heading: 'Immigration: the demand shock that reversed',
        body: "From 2022 through 2024 Canada's population grew by more than a million people a year, driven mostly by temporary residents, meaning international students and temporary foreign workers. That is a lot of people looking for a bedroom in a country already short of them. Rents in Toronto climbed fast. Then Ottawa cut the temporary resident targets sharply in late 2024.\n\nThe effect showed up within about a year. Asking rents in Toronto fell through 2025 after years of increases. That is the cleanest natural experiment this market has given us. Demand from newcomers was a real driver of rent, and turning the tap down brought rents down. It did much less to purchase prices, because the person renting a room and the person buying a semi in Richmond Hill are usually not the same person."
      },
      {
        heading: 'Rates: the lever everyone watches and the one that matters least',
        body: "The Bank of Canada took its policy rate from 0.25% to 5% across 2022 and 2023, then cut it back to 2.25% by October 2025. Mortgage rates followed. Sales volumes swung hard. Prices moved comparatively little, drifting from about $1.19 million at the 2022 peak to $1.07 million last year, a decline of roughly a tenth over three years while the cost of borrowing did a full round trip.\n\nThat tells you something. When rates went up, prices did not crash, because sellers pulled listings rather than accept less. When rates came down, prices did not surge, because buyers were already stretched and inventory had finally built up. Rates change who can afford to buy. They do not change how many homes exist."
      },
      {
        heading: 'What would actually change the number',
        body: "More homes, built faster, where people already want to live. That means allowing fourplexes and small apartment buildings on ordinary residential streets, cutting the development charges that make small projects unviable, and approving permits in months instead of years. Toronto and a handful of other cities have started. The province has moved more slowly than its own housing task force recommended back in 2022.\n\nMy read is that prices here stay roughly flat in nominal terms for a few years while incomes catch up a little, rents stay soft as long as population growth stays low, and the people who benefit are the ones who can afford to wait. That is not a satisfying answer if you are 25. It is the honest one."
      }
    ]
  },
  {
    slug: 'entry-level-jobs-when-ai-does-the-junior-work',
    num: '#005',
    title: 'The entry-level job market when AI does the junior work',
    tag: 'Work',
    date: 'June 1, 2026',
    readTime: '8 min read',
    summary: 'Canadian youth unemployment is near 14% without a recession. How much of that is AI, and what a first job looks like now.',
    intro: "Canada's unemployment rate for people aged 15 to 24 averaged 13.8% last year, up from 10.4% in 2023, and it did that without a recession. For new graduates the picture is not much better. Some of that is the economy. Some of it is that the tasks a junior hire used to do are now done by a model in ten seconds.",
    figure: {
      kind: 'line',
      title: 'Canadian youth unemployment rate, ages 15 to 24',
      caption: 'Annual average, Statistics Canada Labour Force Survey. The 2020 spike was the pandemic. The climb through 2024 and 2025 happened while the overall economy kept growing.',
      unit: '%',
      data: [
        { label: '2019', value: 11.0 },
        { label: '2020', value: 20.1 },
        { label: '2021', value: 13.6 },
        { label: '2022', value: 10.0 },
        { label: '2023', value: 10.4 },
        { label: '2024', value: 13.3 },
        { label: '2025', value: 13.8 },
      ],
    },
    sections: [
      {
        heading: 'What a junior job was actually for',
        body: "A first job in consulting, law, accounting, marketing or software was mostly a training arrangement wearing the costume of work. The firm paid you a real salary to do the parts of the job that were tedious but teachable. Draft the first version of the memo, build the model, pull the comparables, write the boilerplate. You were slow and the work needed checking, but two years later you could do the senior person's job.\n\nThose tasks are precisely the ones current models handle well. A first draft, a first model, a first pass at the research. Not the judgement about whether the draft is right, but the draft itself. So the economic reason to hire a junior, which was that a senior's time cost too much to spend on drafts, is weaker than it was."
      },
      {
        heading: 'What the data shows so far',
        body: "The clearest signal is in hiring, not firing. Large firms are not laying off analysts and blaming AI. They are hiring fewer of them. Postings for entry-level software roles in North America fell sharply from their 2022 peak and did not recover with the rest of the market. Postings for senior roles held up better.\n\nSeparating that from the interest rate cycle is hard, because tight money hit hiring at the same time. The most useful piece of evidence I have seen is a 2025 study by Erik Brynjolfsson and colleagues at Stanford, using payroll records from millions of American workers. They found employment for workers in their early twenties fell noticeably in the occupations most exposed to AI, while employment for older workers in those same occupations did not. That is the pattern you would expect if the junior rung specifically were being automated."
      },
      {
        heading: 'The pipeline problem nobody has solved',
        body: "If firms stop hiring juniors, in five years they have no mid-level people, and in ten years no seniors. Every firm knows this and every firm is hoping somebody else trains the next generation. It is a collective action problem of the standard kind. The rational move for one company is to skip the junior class this year. The rational move for the industry is to keep hiring. Those point in opposite directions.\n\nSome firms are trying to redesign the first job rather than delete it. Fewer hires, each one paired with a senior from the first week and given real responsibility sooner, with the model doing the drafting. Whether that works at scale is genuinely unknown, and it is the question I would ask in any interview."
      },
      {
        heading: 'What to do about it if you are seventeen',
        body: "Stop optimising for the things a model does well. Clean essays, tidy spreadsheets, code that follows the obvious pattern. Those are still table stakes, but they are no longer what gets you hired.\n\nWhat gets you hired is judgement, which means the ability to look at a draft and know it is wrong, and the ability to pick what to work on in the first place. You build that by doing real things with consequences attached. Running a club with a budget, building something people actually use, competing at something where you can lose in public. I would take a student who has done one of those over one with a perfect transcript, and increasingly so would the firms."
      }
    ]
  },
  {
    slug: 'semiconductors-export-controls-canada',
    num: '#004',
    title: 'Chips, export controls and where Canada fits in the supply chain',
    tag: 'Global',
    date: 'May 25, 2026',
    readTime: '9 min read',
    summary: 'One island makes almost all the advanced logic on earth. Where the choke points are, what export controls do, and what Canada actually contributes.',
    intro: "The most advanced chips in the world are designed in California, made in Taiwan on machines built in the Netherlands, and packaged across Southeast Asia. No single country can make one alone. That is why export controls on chips have become the sharpest tool in the rivalry between Washington and Beijing, and why a country like Canada, which makes almost none of them, still has a stake in how it goes.",
    figure: {
      kind: 'bars',
      title: 'Share of advanced logic chip capacity, 10nm and below',
      caption: "Taiwan holds roughly 92% of the world's advanced logic capacity, with TSMC alone producing more than 90% of the most advanced chips, according to industry capacity estimates. TSMC took a record 70.2% of all foundry revenue in the second quarter of 2025.",
      unit: '%',
      data: [
        { label: 'Taiwan', value: 92 },
        { label: 'Everywhere else', value: 8 },
      ],
    },
    sections: [
      {
        heading: 'Four choke points',
        body: "Follow a chip backwards. The finished processor came from a fab, and for the most advanced chips that fab is almost certainly TSMC in Taiwan, with Samsung in South Korea a distant second. The fab used extreme ultraviolet lithography machines, and the only company on earth that makes them is ASML in the Netherlands, at a price per machine in the hundreds of millions of dollars. The machine's design and the chip's design were done with software from a small number of mostly American firms. And the chip itself was designed by a company like Nvidia or Apple, also American.\n\nEach of those is a choke point, meaning a place where one country or one company can say no. Export controls work by saying no at the choke points you control. The United States controls the design software and the chip designers. It has persuaded the Netherlands and Japan to restrict the machines. Taiwan controls the fabs, and everyone is nervous about that."
      },
      {
        heading: 'What the controls actually do',
        body: "Since 2022 the United States has restricted sales of the most advanced AI chips and chipmaking tools to China. The rules have been tightened, loosened and tightened again several times, and companies like Nvidia have designed deliberately slower chips to sell into China within the limits.\n\nDid it work? Partly. Chinese labs have kept releasing capable models, sometimes on older hardware and sometimes on chips that found their way in regardless. Chinese chipmakers have made real progress, but by most public accounts they remain years behind at the most advanced nodes and cannot buy the machines that would close the gap. The controls did not stop Chinese AI. They made it more expensive and slower, which is what export controls usually do."
      },
      {
        heading: 'Where Canada fits',
        body: "Not at the front, honestly. Canada has no leading-edge fab and is not going to get one. What Canada has is upstream and downstream. Upstream there are critical minerals that feed the supply chain, and a great deal of hydroelectric power that data centres want. Downstream there is research, since Toronto and Montreal were early homes of deep learning, a handful of specialised chip design firms, and a growing number of data centres in Quebec and Ontario.\n\nThe Canadian bet, to the extent there is one, is on being the place where the chips get used rather than made. Cheap, clean electricity and cold weather are genuine advantages for a building full of accelerators. Whether that turns into employment beyond construction and security staff is a fair question, and I have not seen a convincing answer."
      },
      {
        heading: 'What I would watch',
        body: "Three things. Whether TSMC's Arizona fabs reach the yields its Taiwanese fabs get, because if they do the geography of the industry changes and the Taiwan concentration risk shrinks. Whether the control list keeps widening to cover chips bought by data centres in third countries, since that would touch Canada directly. And the electricity numbers, because Ontario is already looking at a supply crunch this decade. If data centres take the surplus, the argument over who gets the electrons becomes a political fight, and it will be a loud one."
      }
    ]
  },
  {
    slug: 'canada-productivity-problem-and-ai',
    num: '#003',
    title: "Canada's productivity problem, and whether AI fixes it",
    tag: 'Analysis',
    date: 'May 18, 2026',
    readTime: '8 min read',
    summary: "Canadian output per hour grew a quarter as fast as America's since 1999. The Bank of Canada called it an emergency. AI is the hoped-for fix.",
    intro: "In March 2024 the Bank of Canada's senior deputy governor, Carolyn Rogers, gave a speech titled \"Time to break the glass\" about Canadian productivity. That is not the register central bankers usually use. The gap with the United States has kept widening since. Now AI is being sold as the fix, and I am hopeful and sceptical at the same time.",
    figure: {
      kind: 'bars',
      title: 'Growth in labour productivity, 1999 to 2025',
      caption: 'Cumulative growth in output per hour worked, Canada versus the United States, as reported by Statistics Canada. American productivity grew about two and a half times as fast over the same twenty-six years.',
      unit: '%',
      data: [
        { label: 'Canada', value: 26.7 },
        { label: 'United States', value: 67.9 },
      ],
    },
    sections: [
      {
        heading: 'What productivity is, and why it is the whole game',
        body: "Productivity is how much you get out for each hour you put in. It sounds like an accounting term, but over a long enough stretch it is the only thing that raises living standards. Wages, pensions, hospital budgets and house prices all eventually run into the limit of what the country produces per hour.\n\nCanada's problem is not that people work less. Canadians work roughly as many hours as Americans. The problem is that each hour produces less. Statistics Canada has put business sector productivity here at about 73% of the American level, a gap of 27 percentage points. The OECD's numbers for 2023 put Canadian output at roughly US$75 per hour worked against about US$97 in the United States. Over a working life that difference compounds into a large gap in income."
      },
      {
        heading: 'The usual suspects',
        body: "Economists have a list. Canadian businesses invest less in machinery, software and research per worker than American ones. The country has a lot of small firms that stay small, partly because of tax thresholds that reward staying under them. Interprovincial trade barriers make the domestic market smaller than the map suggests. And a large share of the economy sits in sectors like real estate and construction that do not get more productive quickly.\n\nStatistics Canada put a number on the firm size problem last year. Canadian small firms run at about 70% of the productivity of their American counterparts, while large Canadian firms manage 87%. Between the higher share of small firms and their lower productivity, firm size accounts for around 60% of the whole Canada-US gap. That is a specific, addressable finding, which makes it more useful than the usual hand-waving about culture.\n\nIt is also uncomfortable, because it means the housing boom that made a lot of people feel wealthy was pulling capital away from the things that would have made the country actually richer."
      },
      {
        heading: 'What AI could do',
        body: "The optimistic story runs like this. Most Canadian workers are in services, services productivity is hard to raise, and AI is the first technology that directly raises the output of a person sitting at a desk. Early controlled studies of customer service agents and of programmers using AI assistance found double-digit percentage gains on the specific tasks measured, with the largest gains going to the least experienced workers.\n\nThe sceptical story is that we have heard this before. Computers arrived in every office through the 1980s and the productivity statistics did not move for a decade. Robert Solow's line from 1987 still lands: you can see the computer age everywhere but in the productivity statistics. Technology shows up in the numbers only when businesses reorganise around it, and Canadian businesses have been slow to reorganise around anything."
      },
      {
        heading: 'My read',
        body: "AI raises the ceiling. It does not change the habits that keep Canadian firms well below the ceiling. A company that would not buy software in 2019 is not going to redesign its workflow around a language model in 2026 because a central banker used a dramatic phrase in a speech.\n\nSo the fix is boring. Tax rules that stop punishing growth, a real single market inside the country, and public procurement that is willing to buy from young firms. AI makes every one of those reforms pay off faster. It does not replace them. Anyone telling you the gap closes on its own because the tools got better is selling something."
      }
    ]
  },
  {
    slug: 'how-ai-model-pricing-collapsed',
    num: '#002',
    title: 'How AI model pricing collapsed, and who actually pays for inference',
    tag: 'AI',
    date: 'May 11, 2026',
    readTime: '8 min read',
    summary: 'A million tokens of GPT-4-class output went from $20 to 40 cents in about three years. Where the money went, and who is still paying the bill.',
    intro: "When GPT-4's API launched in March 2023 it cost $30 per million input tokens and $60 per million output tokens. Three years later you can buy better performance for cents. That is one of the fastest price declines of any major input in modern economic history, and it changes who wins.",
    figure: {
      kind: 'bars',
      title: 'Cost of GPT-4-level capability, per million tokens',
      caption: "Andreessen Horowitz's LLMflation analysis tracks the cheapest model reaching a fixed GPT-4-level benchmark score. The fall from about $20 to about $0.40 is a decline of roughly 98% in three years, close to ten times cheaper each year.",
      unit: 'USD',
      data: [
        { label: 'Late 2022', value: 20 },
        { label: '2025', value: 0.4 },
      ],
    },
    sections: [
      {
        heading: 'Why the price fell',
        body: "Three things happened at once. The hardware got faster and, per unit of useful work, cheaper. The models got more efficient, through techniques like distillation, where a large model trains a much smaller one to do most of what it does. And the labs started competing on price, because once two models are close in quality the only lever left is the invoice.\n\nThe result is that inference, meaning running a trained model to answer a question, went from a scarce expensive thing to something closer to electricity. You still pay for it. You just stop thinking about it. Google was listing Gemini 3.1 Flash at $0.10 per million input tokens and $0.40 per million output tokens this April. A frontier-class model like Claude Sonnet 4.6 runs about $3 per million input tokens, which is a tenth of what GPT-4 cost at launch for considerably better output."
      },
      {
        heading: 'Where the money went',
        body: "Follow the dollar. A company paying for tokens sends money to a lab. The lab spends most of it on compute, so most of it goes to a cloud provider or a specialised GPU host. Those companies send a large share of it to Nvidia for hardware, and Nvidia sends a large share of that to TSMC for manufacturing.\n\nThe margins along that chain are wildly uneven. Nvidia reported a GAAP gross margin of 71.1% for fiscal 2026 on $215.9 billion of revenue. The cloud providers earn healthy but ordinary margins. The labs, by most public reporting, lose money on frontier models and hope to make it back at scale. The company selling the shovels made the money. The companies digging are still hoping."
      },
      {
        heading: 'Who pays now',
        body: "Increasingly, not the individual user. The price of a chat has fallen below what most people would notice, so the labs bundle it into subscriptions or give it away and charge businesses instead. The real paying customers now are companies running models inside their own products, for customer service, coding tools, document processing and search. They buy tokens by the billion at prices that never appear on a public page.\n\nThe other payer is the investor. Every large lab has raised money at a valuation that only makes sense if inference eventually becomes a very large and very profitable business. That money is subsidising today's prices. If the investors are right, the subsidy ends when scale arrives. If they are wrong, prices go up, and the products built on cheap tokens get more expensive."
      },
      {
        heading: 'What this means for a business built on AI',
        body: "If your product is a thin layer over someone else's model, your costs keep falling and so do your competitors'. Good for users, bad for margins. The businesses that hold up are the ones where the model is one ingredient and the value sits in the data, the workflow, or the customer relationship.\n\nMy read is that token prices keep falling for another couple of years, then flatten as the labs need to show profits. The window where you can build on nearly free intelligence is open now. It will not stay open forever, and the companies treating cheap inference as permanent will be the ones surprised when the bill arrives."
      }
    ]
  },
  {
    slug: 'bank-of-canada-rate-path-ontario-households',
    num: '#001',
    title: "The Bank of Canada's rate path and what it means for an Ontario household",
    tag: 'Economics',
    date: 'May 4, 2026',
    readTime: '8 min read',
    summary: 'The policy rate went from 0.25% to 5% and back to 2.25%. Most people experienced that round trip through one number: their renewal.',
    intro: "The Bank of Canada raised its policy rate from a quarter of a percent to five percent in about eighteen months, then cut it back to 2.25% by October 2025. That round trip is the biggest thing that has happened to Ontario household budgets this decade, and most people experienced it through one number, which was the rate on their mortgage renewal.",
    figure: {
      kind: 'line',
      title: 'Bank of Canada policy interest rate, at year end',
      caption: 'Target for the overnight rate on 31 December of each year, from the Bank of Canada. The increases through 2022 and 2023 were the fastest tightening cycle since the early 1990s.',
      unit: '%',
      data: [
        { label: '2019', value: 1.75 },
        { label: '2020', value: 0.25 },
        { label: '2021', value: 0.25 },
        { label: '2022', value: 4.25 },
        { label: '2023', value: 5.0 },
        { label: '2024', value: 3.25 },
        { label: '2025', value: 2.25 },
      ],
    },
    sections: [
      {
        heading: 'What the policy rate actually is',
        body: "The Bank of Canada sets one number, the target for the overnight rate, which is what banks charge each other to borrow for a day. Everything else follows from it. Variable-rate mortgages move with it almost immediately. Fixed-rate mortgages move with bond yields, which move with what investors expect the Bank to do next. Savings account rates move with it slowly and grudgingly.\n\nThe Bank has one official target, inflation at two percent, and the rate is how it gets there. Raise the rate and borrowing gets expensive, people spend less, prices rise more slowly. Cut it and the reverse. It is a blunt tool. It cannot make groceries cheaper or build houses. It can only make people spend less or more."
      },
      {
        heading: 'Why the Bank is stuck',
        body: "Inflation is close enough to target that there is no case for tightening on that basis alone. The economy is soft, with unemployment above where it sat before the pandemic and growth barely positive, which argues for cutting. And the trade dispute with the United States argues for both at once, because tariffs push prices up, which is inflationary, and push exports down, which is a drag on growth.\n\nThat is why the Bank's statements this year have read like careful hedging. Governor Tiff Macklem has said plainly that the Bank cannot offset the effects of a trade war with rate cuts, only cushion them. Translated, the tool does not fit the problem, so the Bank is moving slowly and waiting for data."
      },
      {
        heading: 'The renewal wall',
        body: "Here is the part that matters at a kitchen table in Richmond Hill. Most Canadian mortgages run on five-year terms. A household that bought or refinanced in 2020 or 2021 locked in a rate near two percent. Their renewal in 2025 or 2026 comes at something closer to four.\n\nRun the arithmetic on a $600,000 mortgage with twenty-five years of amortisation left. At 2% the payment is about $2,540 a month. At 4% it is about $3,170. That is roughly $620 more every month, before property taxes and insurance, which also went up.\n\nThe Bank has flagged that the majority of outstanding mortgages come up for renewal by the end of 2026, most of them at higher rates than they carried. That is a slow squeeze on household spending, and it is one reason retail and restaurant spending in Ontario has stayed soft even as rates came down. The cuts help. They do not undo the round trip."
      },
      {
        heading: 'What to expect',
        body: "My read is that the policy rate stays near 2.25% through most of this year unless the trade situation deteriorates badly, in which case the Bank cuts further and accepts slightly more inflation. Fixed mortgage rates depend on bond markets, which depend on the United States as much as on Ottawa, so they may not fall as far as people hope even if the Bank does cut.\n\nIf you are renewing this year, the choice between fixed and variable is closer than it has been in a while. If you are a student trying to make sense of this, the thing to hold onto is that the rate is the Bank's answer to inflation, and inflation right now is being pushed around by a trade dispute the Bank did not start and cannot end."
      }
    ]
  },
]

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug)
}
