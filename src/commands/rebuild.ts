import { IssueCommentEvent, PullRequest } from "@octokit/webhooks-types";
import yargs from "yargs";
import octokit from "../instances/octokit";
import { startPRCheck, leaveComment } from "../util";

const notAuthorized = ":x: You aren't allowed to use this command.";
const errorGettingPull = ":x: Error getting pull request.";

export default async function rebuildCommand(argv: yargs.ArgumentsCamelCase) {
  const body = argv.body as IssueCommentEvent;
  const userAllowed = octokit.rest.orgs.checkMembershipForUser({
    org: process.env["GITHUB_ORG"]!,
    username: body.sender.login
  });
  if (!userAllowed) {
    leaveComment(body, notAuthorized);
    return;
  }
  if (body.action === "created" && body.issue.pull_request !== undefined) {
    const pull = await octokit.rest.pulls.get({
      owner: body.repository.owner.login,
      repo: body.repository.name,
      pull_number: body.issue.number
    });
    if (pull) {
      startPRCheck(body, pull.data as PullRequest);
    } else {
      leaveComment(body, errorGettingPull);
    }
  } else {
    leaveComment(body, errorGettingPull);
  }
}
