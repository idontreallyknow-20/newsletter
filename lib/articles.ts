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
    summary: 'Free model weights are not free. Who pays to train them, who captures the value, and why both camps might survive.',
    intro: "Every few months a lab releases a model anyone can download and run. Every few months a different lab argues that this is reckless, or unsustainable, or both. Strip out the safety debate and what is left is a pricing question, and pricing questions have answers.",
    figure: {
      kind: 'bars',
      title: 'Where the money goes in a frontier training run',
      caption: 'Approximate share of cost for a large 2025 training run. Compute dominates; the weights themselves are a by-product. Illustrative breakdown based on public disclosures from Meta, Anthropic and OpenAI.',
      unit: '%',
      data: [
        { label: 'Compute', value: 62 },
        { label: 'Data', value: 11 },
        { label: 'Research staff', value: 19 },
        { label: 'Energy', value: 5 },
        { label: 'Other', value: 3 },
      ],
    },
    sections: [
      {
        heading: 'What a weight file actually is',
        body: "A model's weights are a very large list of numbers, a few hundred gigabytes for a frontier model. Once they exist, copying them costs nothing. That is the whole economic puzzle in one sentence. The thing that took hundreds of millions of dollars to make can be duplicated for the price of bandwidth.\n\nClosed labs (OpenAI, Anthropic, Google DeepMind) keep the file private and sell access by the token. Open-weight labs (Meta with Llama, Mistral, DeepSeek, the Qwen team at Alibaba) publish the file and make money somewhere else, or not yet at all. The word 'open source' gets used loosely here. Most of these releases share the weights but not the training data or the full recipe, so you can run the model and fine-tune it, but you could not rebuild it from scratch."
      },
      {
        heading: 'Why a company would give away a billion-dollar asset',
        body: "Meta is the clearest case. It does not sell model access. It sells advertising on Facebook, Instagram and WhatsApp, and it wants AI features in those products to be cheap. If open weights push the whole industry's prices toward zero, Meta's costs fall and its competitors' revenue falls. That is a good trade for Meta and a bad one for OpenAI. Mark Zuckerberg has said roughly this out loud on earnings calls.\n\nThe second reason is talent and standards. Researchers want their work used. A model that runs on every university cluster and every startup laptop becomes the default that people build tools around, and the lab that publishes it sets the conventions everyone else has to follow. Linux did this to Unix in the 1990s. Android did it to the phone market.\n\nThe third reason is the one nobody says in a press release: it is a way to be relevant when you are behind. DeepSeek's releases in early 2025 forced a rerun of every 'how much does frontier AI cost' spreadsheet in the industry. Publishing was the cheapest way to prove the claim."
      },
      {
        heading: 'What the closed labs are really selling',
        body: "If weights were the product, closed labs would be finished. They are not finished, and the reason is that the product is the running service. Uptime, latency, safety tuning, a support contract, a compliance certificate, and the guarantee that the model you tested in March still behaves the same way in September. Enterprises pay for that. Governments pay more for it.\n\nThere is also a capability gap, and it matters how long it lasts. In most public benchmarks the best open model trails the best closed model by somewhere between six and twelve months. For a lot of tasks that gap is irrelevant. For the hardest tasks, the ones a bank or a drug company will pay top dollar for, it is the entire business.\n\nSo the honest picture is a price ladder. Free-to-run open models at the bottom, mid-priced closed APIs in the middle, and a thin, expensive frontier at the top that is rebuilt every year. Most of the volume will end up at the bottom. Most of the revenue will stay near the top for a while."
      },
      {
        heading: 'What I would watch',
        body: "Two numbers. First, the price per million tokens for a model at a fixed capability level. It has fallen by roughly ten times a year since 2023. If that continues, the middle rung of the ladder gets squeezed out, and the closed labs live entirely on the frontier and on enterprise contracts.\n\nSecond, the gap between the best open and best closed model on hard reasoning tasks. If it closes to a couple of months, the frontier stops being a moat and becomes a marketing expense. If it widens, the closed labs' bet pays off.\n\nMy read: both camps survive, and the interesting company is whichever one figures out how to make money from running open models well. That is a services business, not a research business, and services businesses are where the boring, durable profits usually live."
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
    summary: 'The Canada-US-Mexico trade deal comes up for review in 2026. Here is what the tariff threat means for the plants along the 401.',
    intro: "About three quarters of everything Ontario exports goes to the United States, and a large share of it is cars, car parts, steel and aluminum. So when Washington talks about tariffs, it is not an abstract trade story here. It is a question about whether the plant in Oakville or Windsor or Hamilton runs a third shift next year.",
    figure: {
      kind: 'bars',
      title: 'Ontario goods exports by destination',
      caption: 'Share of Ontario merchandise exports by destination, approximate, based on Statistics Canada trade data. The United States takes the overwhelming majority.',
      unit: '%',
      data: [
        { label: 'United States', value: 79 },
        { label: 'EU', value: 5 },
        { label: 'China', value: 3 },
        { label: 'Mexico', value: 2 },
        { label: 'UK', value: 2 },
        { label: 'Rest', value: 9 },
      ],
    },
    sections: [
      {
        heading: 'How a car crosses the border seven times',
        body: "The thing people miss about auto tariffs is that a car is not made in one country. An engine block cast in Ontario goes to Michigan for machining, back to Ontario for assembly into an engine, then to a plant in Ohio to go into a vehicle that is shipped to a dealer in Toronto. Industry groups say some parts cross the border six or seven times before the car is sold.\n\nA tariff is charged each time. So a 25 percent tariff is not a 25 percent cost increase on a car. Depending on how the rules of origin are applied, it can be more, and the paperwork alone is enough to make a plant manager move production to whichever side of the border avoids the crossing. That is the actual threat: not the tax, but the incentive to consolidate on one side, and the bigger market is not ours."
      },
      {
        heading: 'What the 2026 review is',
        body: "CUSMA, the deal that replaced NAFTA in 2020, has a clause requiring the three countries to sit down in 2026 and decide whether to extend it. If all three agree, it runs another sixteen years. If they do not, it enters annual reviews, which is a polite way of saying permanent uncertainty.\n\nUncertainty has its own price. A company deciding where to build a battery plant or a stamping line wants to know the tariff rate for the next decade, not the next twelve months. When the answer is 'we will review it every year', the safe choice is to build in the biggest market, and the biggest market is the United States. That is true even if the tariff never actually goes up. The threat does the work."
      },
      {
        heading: 'What the numbers say versus what politicians claim',
        body: "The claim from Washington is that tariffs bring factories home. The evidence from the 2018 steel and aluminum tariffs is mixed at best. US steel production rose a little, and the price of steel for every US manufacturer that uses it rose more. Studies from the Federal Reserve and the Peterson Institute found the tariffs cost more jobs in steel-using industries than they created in steel-making. The cost per job saved ran into the hundreds of thousands of dollars.\n\nOn the Canadian side, the claim is that we can diversify away from the US market. The Ontario export chart above says how far that has to go. Europe and Asia together take about a tenth of what the US takes, and they are an ocean away from a plant in Windsor. Diversification is a twenty-year project, not a policy announcement."
      },
      {
        heading: 'What a Grade 11 student in Richmond Hill should take from this',
        body: "If you are planning to study business or engineering, the industries that are most exposed are also the ones that hire the most co-op students in this province. Automotive, steel, plastics, machinery. None of them are going away, but the good jobs in them are going to cluster around whichever plants win the consolidation fight.\n\nThe practical read: watch the review, but watch investment announcements more. A plant expansion in Ontario means a company decided the tariff risk was survivable. A plant expansion in Kentucky that was originally rumoured for Ontario means the opposite. Those announcements tell you more about the next decade than any statement from a trade minister."
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
    summary: 'Prices cooled, rents cooled, and almost nobody under 35 can buy. A look at the three levers and which one actually moved.',
    intro: "Ask anyone in Toronto why housing costs what it costs and you get one of three answers: not enough building, too many people, or interest rates. All three are true. They are not equally true, and the order matters if you want to know what happens next.",
    figure: {
      kind: 'line',
      title: 'Average Greater Toronto home price',
      caption: 'Average sale price across all home types, Toronto Regional Real Estate Board data, rounded. The peak was early 2022; prices have drifted lower since while rents did the same in 2024 and 2025.',
      unit: 'CAD k',
      data: [
        { label: '2019', value: 820 },
        { label: '2020', value: 930 },
        { label: '2021', value: 1095 },
        { label: '2022', value: 1190 },
        { label: '2023', value: 1125 },
        { label: '2024', value: 1115 },
        { label: '2025', value: 1080 },
      ],
    },
    sections: [
      {
        heading: 'Supply: the fifteen-year hole',
        body: "Ontario built fewer homes per person in the 2010s than it did in the 1970s, and the population grew faster. The Canada Mortgage and Housing Corporation has estimated the country needs something like three and a half million extra homes by 2030 on top of what would normally be built to get back to 2004 levels of affordability. Ontario's share of that is the largest.\n\nThe reason is not mysterious. In most of the GTA it takes years to get a permit, development charges on a new condo run well into the tens of thousands of dollars, and the zoning in most residential neighbourhoods allows one house per lot. Every one of those is a municipal or provincial decision. None of them is a market outcome."
      },
      {
        heading: 'Immigration: the demand shock that reversed',
        body: "From 2022 to 2024 Canada's population grew by more than a million people a year, mostly through temporary residents: international students and temporary foreign workers. That is a lot of people looking for a bedroom in a country that was already short on bedrooms. Rents in Toronto rose fast, and then the federal government cut the temporary resident targets hard in late 2024.\n\nThe effect showed up within about a year. Rents for one-bedroom units in Toronto fell in 2025 for the first time in a long time. That is the cleanest natural experiment we have had in this market. Demand from newcomers was a real driver of rent, and turning the tap down brought rents down. It did not do much for purchase prices, because the people who rent a room and the people who buy a semi in Richmond Hill are different people."
      },
      {
        heading: 'Rates: the lever everyone watches and the one that matters least',
        body: "The Bank of Canada took its policy rate from a quarter of a percent to five percent in 2022 and 2023, then cut it back toward the mid-twos through 2025. Mortgage rates followed. Sales volumes swung wildly. Prices barely moved.\n\nThat tells you something. When rates went up, prices did not crash, because sellers pulled listings rather than accept less. When rates came down, prices did not surge, because buyers were stretched already and the supply of new listings finally picked up. Rates change who can afford to buy. They do not change how many homes exist."
      },
      {
        heading: 'What would actually change the number',
        body: "More homes, built faster, in the places people already want to live. That means allowing fourplexes and small apartment buildings on ordinary residential streets, cutting the development charges that make small projects unviable, and approving permits in months instead of years. Toronto and a handful of other cities have started. The province has moved slower than its own housing task force recommended.\n\nMy read: prices in the GTA stay roughly flat for a few years while incomes catch up a little, rents stay soft as long as population growth stays low, and the people who benefit are the ones who can wait. That is not a satisfying answer if you are 25. It is the honest one."
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
    summary: 'Youth unemployment in Canada is the highest outside a recession in decades. How much of that is AI, and what a first job looks like now.',
    intro: "Canada's unemployment rate for people aged 15 to 24 sat above 14 percent for much of 2025, the worst reading outside a recession since the 1990s. For new graduates the picture was not much better. Some of that is the economy. Some of it is that the tasks a junior hire used to do are now done by a model in ten seconds.",
    figure: {
      kind: 'line',
      title: 'Canadian youth unemployment rate, ages 15 to 24',
      caption: 'Annual average, Statistics Canada Labour Force Survey, rounded. The 2020 spike was the pandemic; the 2025 level came without a recession.',
      unit: '%',
      data: [
        { label: '2019', value: 11.0 },
        { label: '2020', value: 20.1 },
        { label: '2021', value: 13.5 },
        { label: '2022', value: 10.0 },
        { label: '2023', value: 10.7 },
        { label: '2024', value: 13.0 },
        { label: '2025', value: 14.2 },
      ],
    },
    sections: [
      {
        heading: 'What a junior job used to be for',
        body: "A first job in consulting, law, accounting, marketing or software was mostly a training arrangement disguised as work. The firm paid you a real salary to do the parts of the job that were tedious but teachable: draft the first version of the memo, build the model, pull the comparables, write the boilerplate. You were slow and the work needed checking, but two years later you could do the senior person's job.\n\nThose tasks are precisely the ones that current AI models do well. A first draft, a first model, a first pass at the research. Not the judgement about whether the draft is right, but the draft itself. So the economic reason to hire a junior, which was that a senior's time was too expensive to spend on drafts, is weaker than it was."
      },
      {
        heading: 'What the data shows so far',
        body: "The clearest signal is in hiring, not firing. Large firms are not laying off analysts because of AI. They are hiring fewer of them. Job postings for entry-level software roles in North America fell sharply from their 2022 peak and did not recover with the rest of the market. Postings for senior roles held up.\n\nIt is hard to separate this from the interest rate cycle, which hit hiring at the same time. Researchers at Stanford who looked at payroll data in 2025 found that employment for workers in their early twenties in the most AI-exposed occupations fell noticeably, while employment for older workers in the same jobs did not. That is the pattern you would expect if the junior rung were being automated first."
      },
      {
        heading: 'The pipeline problem nobody has solved',
        body: "If firms stop hiring juniors, in five years they have no mid-level people, and in ten years no seniors. Every firm knows this and every firm is hoping someone else trains the next generation. It is a classic collective action problem. The rational move for one company is to skip the junior class this year. The rational move for the industry is to keep hiring. Those two things point in opposite directions.\n\nSome firms are trying to redesign the first job instead of eliminating it. Fewer hires, but each one paired with a senior from day one and given real responsibility faster, with the model doing the drafting. Whether that works at scale is an open question, and it is the question I would ask in any interview."
      },
      {
        heading: 'What to do about it if you are seventeen',
        body: "Stop optimising for the skills that a model does well. Perfect essays, clean spreadsheets, tidy code that follows the pattern. Those are still table stakes, but they are no longer the thing that gets you hired.\n\nThe thing that gets you hired is judgement, which is the ability to look at a draft and know it is wrong, and the ability to decide what to work on in the first place. You build that by doing real things with real consequences: running a club with a budget, building something people use, competing at something where you can lose. I would take a student who has done one of those over one with a perfect transcript, and increasingly so would the firms."
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
    summary: 'A modern chip crosses four countries before it is finished. Where the choke points are, what the export controls do, and what Canada actually contributes.',
    intro: "The most advanced chips in the world are designed in California, made in Taiwan on machines built in the Netherlands, and packaged in Malaysia. No single country can make one alone. That is why export controls on chips have become the sharpest tool in the US-China rivalry, and why a country like Canada, which makes almost none of them, still has a stake.",
    figure: {
      kind: 'bars',
      title: 'Share of leading-edge logic chip manufacturing by location',
      caption: 'Approximate share of global capacity for the most advanced process nodes, based on industry estimates. Taiwan, and TSMC in particular, dominates; the US share is small but growing with new fabs in Arizona.',
      unit: '%',
      data: [
        { label: 'Taiwan', value: 88 },
        { label: 'South Korea', value: 8 },
        { label: 'United States', value: 3 },
        { label: 'Other', value: 1 },
      ],
    },
    sections: [
      {
        heading: 'Four choke points',
        body: "Follow a chip backwards. The finished processor came from a fab, and for the most advanced chips that fab is almost certainly TSMC in Taiwan, with Samsung in South Korea a distant second. The fab used lithography machines, and the only company on earth that makes the most advanced ones is ASML in the Netherlands, at something like a few hundred million dollars each. The machine's design and the chip's design were done with software from three companies, all American. And the chip was designed by a company like Nvidia or Apple, also American.\n\nEach of those is a choke point: a place where one country or one company can say no. Export controls work by saying no at the choke points you control. The US controls the design software and the chip designers. It has persuaded the Netherlands and Japan to control the machines. Taiwan controls the fabs, and everyone is nervous about that."
      },
      {
        heading: 'What the controls actually do',
        body: "Since 2022 the US has restricted sales of the most advanced AI chips and chipmaking tools to China. The rules have been tightened, loosened, and re-tightened several times since, and companies like Nvidia have designed special slower chips to sell into China within the limits.\n\nDid it work? Partly. Chinese labs have kept building capable AI models, sometimes on older hardware and sometimes on chips that found their way in anyway. Chinese chipmakers have made progress, but by most accounts they are still years behind on the most advanced nodes and cannot buy the machines to close the gap. The controls did not stop Chinese AI. They made it more expensive and slower, which is what controls usually do."
      },
      {
        heading: 'Where Canada fits',
        body: "Honestly, not at the front. Canada does not have a leading-edge fab and is not going to get one. What Canada has is upstream and downstream. Upstream: raw materials, including some of the critical minerals that go into the supply chain, and a lot of hydro power that data centres want. Downstream: research (the University of Toronto and Montreal were early homes of deep learning), a few specialised chip design firms, and a growing number of data centres in Quebec and Ontario.\n\nThe Canadian bet, to the extent there is one, is on being the place where the chips get used rather than made. Cheap, clean electricity and cold weather are real advantages for a building full of GPUs. Whether that turns into jobs beyond construction and security is a fair question."
      },
      {
        heading: 'What I would watch',
        body: "Three things. First, TSMC's Arizona fabs. If they reach the same yields as Taiwan, the geography of the industry changes and the Taiwan risk shrinks. Early reports say they are getting close. Second, whether the export control list keeps expanding to cover the chips that data centres in third countries can buy, because that would affect Canada directly. Third, the electricity numbers. Ontario is already short on power for the next decade's demand. If data centres take the surplus, the argument about who gets the electrons becomes a political fight, and it will be a loud one."
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
    summary: 'Canadian output per hour has barely grown in a decade. The Bank of Canada called it an emergency. AI is the hoped-for fix; the record says be careful.',
    intro: "In 2024 a senior deputy governor of the Bank of Canada gave a speech calling Canada's productivity an emergency. That is not a word central bankers use casually. Output per hour worked in Canada has grown at less than one percent a year for most of the last decade, and the gap with the United States has widened. Now AI is being sold as the fix. Here is why I am hopeful and sceptical at the same time.",
    figure: {
      kind: 'line',
      title: 'Labour productivity, Canada versus the United States',
      caption: 'Output per hour worked, indexed to 2015 = 100, approximate, from Statistics Canada and the US Bureau of Labor Statistics. The gap has widened almost every year.',
      unit: 'index',
      data: [
        { label: '2015 CA', value: 100 },
        { label: '2017', value: 101 },
        { label: '2019', value: 103 },
        { label: '2021', value: 106 },
        { label: '2023', value: 103 },
        { label: '2025', value: 105 },
      ],
    },
    sections: [
      {
        heading: 'What productivity is, and why it is the whole game',
        body: "Productivity is how much you get out for each hour you put in. It sounds like an accounting term, but over a long enough period it is the only thing that raises living standards. Wages, pensions, hospital budgets and house prices all eventually run into the limit of how much the country produces per hour.\n\nCanada's problem is not that people work less. Canadians work about as many hours as Americans. The problem is that each hour produces less, and the gap is now around 25 to 30 percent depending on how you measure it. Over a working life that compounds into a large difference in income."
      },
      {
        heading: 'The usual suspects',
        body: "Economists have a list. Canadian businesses invest less in machinery, software and research per worker than American ones do. The country has a lot of small firms that stay small, partly because of tax rules that reward staying under thresholds. Interprovincial trade barriers make the domestic market smaller than it looks. And a large share of the economy is in sectors like real estate and construction that do not get more productive quickly.\n\nThe last one is uncomfortable, because it means the housing boom that made a lot of people feel rich was also pulling capital away from the things that would have made the country richer."
      },
      {
        heading: 'What AI could actually do',
        body: "The optimistic story goes like this: most Canadian workers are in services, services productivity is hard to raise, and AI is the first technology that directly raises the output of a person sitting at a desk. Early studies of customer service agents and programmers using AI tools found productivity gains in the range of 15 to 40 percent on the tasks measured, with the biggest gains for the least experienced workers.\n\nThe sceptical story is that we have heard this before. Computers showed up in every office in the 1980s and productivity statistics did not move for a decade. Robert Solow's line from 1987 still applies: you can see the computer age everywhere but in the productivity statistics. Technology only shows up in the numbers when businesses reorganise around it, and Canadian businesses have been slow to reorganise around anything."
      },
      {
        heading: 'My read',
        body: "AI raises the ceiling. It does not change the habits that keep Canadian firms below the ceiling. If a company would not buy software in 2019, it is not going to redesign its workflow around a language model in 2026 because a central banker used the word emergency.\n\nSo the fix is boring. Tax rules that stop punishing growth, a real single market inside the country, and public procurement that buys from young firms. AI makes every one of those reforms pay off faster. It does not replace them. Anyone who tells you the productivity gap closes on its own because the tools got better is selling something."
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
    summary: 'The price of a million tokens has fallen by more than 99 percent in three years. Where the money went, and who is still paying the bill.',
    intro: "In early 2023 the most capable model you could rent cost about sixty dollars per million output tokens. By 2026 a model that is better on every benchmark costs a small fraction of that, and the cheapest usable models cost cents. That is the fastest price decline of any major input in modern economic history, and it changes who wins.",
    figure: {
      kind: 'line',
      title: 'Price per million output tokens, best available model at each date',
      caption: 'Approximate list price in US dollars for a frontier-class model over time, log-scale thinking applies: each step is a large multiple. Based on published API pricing from OpenAI, Anthropic and Google.',
      unit: 'USD',
      data: [
        { label: '2023 H1', value: 60 },
        { label: '2023 H2', value: 30 },
        { label: '2024 H1', value: 15 },
        { label: '2024 H2', value: 10 },
        { label: '2025 H1', value: 8 },
        { label: '2025 H2', value: 5 },
        { label: '2026 H1', value: 3 },
      ],
    },
    sections: [
      {
        heading: 'Why the price fell',
        body: "Three things happened at once. The chips got faster and, per unit of work, cheaper: each generation of Nvidia hardware roughly doubled the useful output per dollar. The models got more efficient, with techniques like distillation, where a big model teaches a small one to do most of what it does at a fraction of the size. And the labs started competing on price, because once two models are close in quality the only lever left is the invoice.\n\nThe result is that inference, which means running a trained model to answer a question, went from a scarce, expensive thing to something closer to electricity. You still pay for it. You just stop thinking about it."
      },
      {
        heading: 'Where the money went',
        body: "Follow the dollar. A company paying for tokens sends money to a lab. The lab spends most of it on cloud compute, which means it sends most of it to Microsoft, Amazon, Google or a specialised GPU host. Those companies send a large share of it to Nvidia for chips, and Nvidia sends a large share of that to TSMC for manufacturing.\n\nAt every step in that chain, the margins are wildly different. Nvidia's gross margin has been above 70 percent. The cloud providers make healthy but normal margins. The labs, by most reporting, lose money on the frontier models and make it back, if at all, on scale. The company that sells the shovels made the money. The companies digging are still hoping."
      },
      {
        heading: 'Who pays now',
        body: "Increasingly, not the user. The price of a chat with a model has fallen below what most people would notice, so the labs bundle it into subscriptions or give it away and charge businesses instead. The real paying customers in 2026 are companies running models inside their own products: customer service, coding tools, document processing, search. They buy tokens by the billion and negotiate prices that never appear on a public price list.\n\nThe other payer is the investor. Every large lab has raised money at valuations that only make sense if inference eventually becomes a very large, very profitable business. That money is subsidising today's prices. If the investors are right, the subsidy ends when scale arrives. If they are wrong, prices have to go up, and the products built on cheap tokens get more expensive."
      },
      {
        heading: 'What this means for a business built on AI',
        body: "If your product is a thin layer over someone else's model, your costs will keep falling and so will your competitors'. That is good for users and bad for margins. The businesses that hold up are the ones where the model is one ingredient and the value is in the data, the workflow, or the relationship with the customer.\n\nMy read: token prices keep falling for another two or three years, then flatten as the labs need to show profits. The window where you can build something on nearly free intelligence is open now. It will not stay open forever, and the companies that treat cheap inference as permanent will be the ones surprised when the bill arrives."
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
    summary: 'The policy rate is back in the mid-twos. What the Bank is watching, why it is stuck, and what a renewal looks like for a family in York Region.',
    intro: "The Bank of Canada raised its policy rate from a quarter of a percent to five percent in about eighteen months, then cut it back toward the mid-twos over the following two years. That round trip is the biggest thing that happened to Ontario household budgets this decade, and most people experienced it through one number: their mortgage renewal.",
    figure: {
      kind: 'line',
      title: 'Bank of Canada policy interest rate',
      caption: 'Target for the overnight rate at year end, Bank of Canada. The 2022 to 2023 increases were the fastest since the early 1990s.',
      unit: '%',
      data: [
        { label: '2019', value: 1.75 },
        { label: '2020', value: 0.25 },
        { label: '2021', value: 0.25 },
        { label: '2022', value: 4.25 },
        { label: '2023', value: 5.0 },
        { label: '2024', value: 3.25 },
        { label: '2025', value: 2.5 },
      ],
    },
    sections: [
      {
        heading: 'What the policy rate actually is',
        body: "The Bank of Canada sets one number: the overnight rate, which is what banks charge each other to borrow for a day. Everything else follows from it. Variable-rate mortgages move with it almost immediately. Fixed-rate mortgages move with bond yields, which move with what investors expect the Bank to do next. Savings account rates move with it slowly and grudgingly.\n\nThe Bank has one official target, inflation at two percent, and it uses the rate to get there. Raise the rate and borrowing gets expensive, people spend less, prices rise more slowly. Cut it and the reverse. It is a blunt tool. It cannot make groceries cheaper or build houses. It can only make people spend less or more."
      },
      {
        heading: 'Why the Bank is stuck',
        body: "Inflation is close to target, which argues for leaving rates alone. The economy is weak, with unemployment above where it was before the pandemic and growth barely positive, which argues for cutting. And the tariff situation with the United States argues for both at once: tariffs push prices up, which is inflationary, and push exports down, which is a drag on growth.\n\nThat is why the Bank's statements in 2026 have read like someone hedging. Governor Tiff Macklem has said the Bank cannot offset the effects of a trade war with rate cuts, only cushion them. The honest translation is that the tool does not fit the problem, so the Bank is moving slowly and waiting for the data."
      },
      {
        heading: 'The renewal wall',
        body: "Here is the part that matters at a kitchen table in Richmond Hill. Most Canadian mortgages are five-year terms. A family that bought or refinanced in 2020 or 2021 locked in a rate near two percent. Their renewal in 2025 or 2026 comes at something closer to four. On a 600,000 dollar mortgage that is roughly 500 to 600 dollars more per month, before property taxes and insurance, which also went up.\n\nThe Bank estimated that a large majority of mortgages outstanding in 2024 would renew by the end of 2026, most at higher rates. That is a slow squeeze on household spending, and it is one reason retail sales and restaurant spending in Ontario have been soft even with rates falling. The cuts help. They do not undo the round trip."
      },
      {
        heading: 'What to expect',
        body: "My read: the policy rate stays in the mid-twos for most of 2026 unless the trade situation gets a lot worse, in which case the Bank cuts toward two and accepts a little more inflation. Fixed mortgage rates depend on bond markets, which depend on the United States as much as on Ottawa, so they may not fall as much as people hope.\n\nIf you are renewing this year, the choice between fixed and variable is closer than it has been in a while. If you are a student trying to understand this, the thing to remember is that the rate is the Bank's answer to inflation, and inflation right now is being pushed around by a trade dispute the Bank did not start and cannot end."
      }
    ]
  },
]

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug)
}
