import { ToolDecorator as Tool, Widget, Injectable, ExecutionContext, z } from '@nitrostack/core';
import { DestinationsService } from './destinations.service.js';

const preferencesInputSchema = z.object({
  budget: z.number().positive().describe('Total group budget in USD for the whole trip'),
  destinationType: z
    .enum(['beach', 'mountain', 'city', 'cultural', 'adventure'])
    .describe('The kind of destination the group wants'),
  days: z.number().int().positive().describe('Number of days for the trip'),
  interests: z
    .array(z.string())
    .describe('Group interests, e.g. snorkeling, nightlife, local food'),
  groupSize: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('Number of travelers in the group (optional)'),
});

const preferencesOutputSchema = z.object({
  summary: z.string(),
  budget: z.number(),
  currency: z.string(),
  destinationType: z.string(),
  days: z.number(),
  groupSize: z.number().nullable(),
  interests: z.array(z.string()),
  budgetPerDay: z.number(),
  budgetPerPersonPerDay: z.number().nullable(),
});

const recommendInputSchema = z.object({
  budget: z.number().positive().describe('Total group budget in USD for the trip'),
  destinationType: z
    .enum(['beach', 'mountain', 'city', 'cultural', 'adventure'])
    .describe('The kind of destination the group wants'),
  days: z.number().int().positive().describe('Number of days for the trip'),
  interests: z
    .array(z.string())
    .describe('Group interests to match against, e.g. snorkeling, nightlife'),
});

@Injectable({ deps: [DestinationsService] })
export class PlanningTools {
  constructor(private destinationsService: DestinationsService) {}

  @Tool({
    name: 'collect-preferences',
    description:
      'Collect and structure a group trip request. Accepts budget, destination type, number of days, and interests, and returns a clean structured summary of the group preferences to drive destination recommendations.',
    inputSchema: preferencesInputSchema,
    outputSchema: preferencesOutputSchema,
  })
  async collectPreferences(
    input: z.infer<typeof preferencesInputSchema>,
    ctx: ExecutionContext
  ) {
    ctx.logger.info('Collecting preferences', {
      budget: input.budget,
      type: input.destinationType,
      days: input.days,
    });

    const budgetPerDay = Math.round(input.budget / input.days);
    const budgetPerPersonPerDay = input.groupSize
      ? Math.round(input.budget / input.days / input.groupSize)
      : null;

    const interestsList = input.interests.length
      ? input.interests.join(', ')
      : 'no specific interests';

    const summary =
      `A ${input.days}-day ${input.destinationType} trip` +
      (input.groupSize ? ` for ${input.groupSize} travelers` : '') +
      ` with a total budget of $${input.budget} (about $${budgetPerDay}/day). ` +
      `The group is interested in ${interestsList}.`;

    return {
      summary,
      budget: input.budget,
      currency: 'USD',
      destinationType: input.destinationType,
      days: input.days,
      groupSize: input.groupSize ?? null,
      interests: input.interests,
      budgetPerDay,
      budgetPerPersonPerDay,
    };
  }

  @Tool({
    name: 'recommend-destination',
    description:
      'Recommend the single best destination for the collected group preferences (budget, type, days, interests) and explain why it fits. Renders a destination card with a live cover photo and a why-it-fits blurb. Also returns alternative destinations to consider.',
    inputSchema: recommendInputSchema,
  })
  @Widget('destination-card')
  async recommendDestination(
    input: z.infer<typeof recommendInputSchema>,
    ctx: ExecutionContext
  ) {
    ctx.logger.info('Recommending destination', {
      type: input.destinationType,
      budget: input.budget,
      interests: input.interests,
    });

    const ranked = await this.destinationsService.recommend({
      budget: input.budget,
      days: input.days,
      type: input.destinationType,
      interests: input.interests,
    });

    const top = ranked[0];
    const dest = top.destination;

    const budgetPerDay = Math.round(input.budget / input.days);
    const affordable = budgetPerDay >= dest.dailyBudget;

    const matched = top.matchedInterests.length
      ? top.matchedInterests.join(', ')
      : 'your travel style';

    const whyItFits =
      `${dest.name} is a great match for a ${input.destinationType} trip. ` +
      `${dest.bestFor} It lines up with your interest in ${matched}, ` +
      (affordable
        ? `and fits comfortably within your ~$${budgetPerDay}/day budget.`
        : `and is achievable with careful planning around your ~$${budgetPerDay}/day budget.`);

    const alternatives = ranked.slice(1, 4).map((r) => ({
      id: r.destination.id,
      name: r.destination.name,
      imageUrl: r.livePhotoUrl || r.destination.imageUrl,
      type: r.destination.type,
    }));

    return {
      id: dest.id,
      name: dest.name,
      type: dest.type,
      imageUrl: top.livePhotoUrl || dest.imageUrl,
      tags: dest.tags,
      dailyBudget: dest.dailyBudget,
      estimatedTripBudget: dest.dailyBudget * input.days,
      whyItFits,
      matchScore: top.score,
      matchedInterests: top.matchedInterests,
      sampleActivities: dest.sampleActivities,
      sampleFood: dest.sampleFood,
      days: input.days,
      alternatives,
    };
  }
}
