import { IssueCommentEvent, PullRequest } from "@octokit/webhooks-types";
import octokit from "./instances/octokit";

export function leaveComment(body: IssueCommentEvent, comment: string) {
  octokit.rest.issues.createComment({
    owner: body.repository.owner.login,
    repo: body.repository.name,
    issue_number: body.issue.number,
    body: comment
  });
}

export function startPRCheck(
  body: IssueCommentEvent,
  pull: PullRequest,
  event_type: string = "start-pr-checks"
) {
  octokit.rest.repos.createDispatchEvent({
    owner: body.repository.owner.login,
    repo: body.repository.name,
    event_type,
    client_payload: {
      ref: pull.head.sha,
      actor: pull.user.login,
      prnum: pull.number,
    }
  })
}