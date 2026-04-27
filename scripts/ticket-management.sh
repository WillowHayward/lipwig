#!/bin/bash
# Usage: Pipe the GitHub event JSON to this script. It will handle issue labeling and assignment based on the event.
# $1 - GitHub event JSON (can be read from $GITHUB_EVENT_PATH)
# cat ${GITHUB_EVENT_PATH} | ./scripts/ticket-management.sh

get_parent() {
    # $1 - issue number
    ticket=$1
    parent=$(gh api graphql -F node_id="$(gh issue view ${ticket} --json id -q .id)" -f query='
    query($node_id: ID!) {
        node(id: $node_id) {
            ... on Issue {
                parent {
                    number
                }
            }
        }
    }' --jq .data.node.parent.number)

    echo $parent
}

labeled() {
    # $1 - issue number
    # $2 - label json block
    ticket=$1
    label=$2
    echo "Handling label event for issue #$1"

    label_type="${label%%:*}"
    label_value="${label#*:}"
    echo "Label type: $label_type, Label value: $label_value"
    if [[ "$label_type" == "resolution" ]]; then
        echo "Resolution label added: $label_value"
        # Close tickets that are resolved
        gh issue close "$ticket"


        # TODO: Will complete later
        # parent=$(get_parent $ticket)
        # echo "Parent issue number: $parent"
        parent=null
        if [[ -n "$parent" && "$parent" != "null" ]]; then
            echo "Checking parent issue #$parent for resolution"
            # If all parent siblings are resolved, move the parent to Review
            siblings=$(gh issue list --search "parent:$parent" --json number,labels -q '.[]')
            all_resolved=true
            for row in $(echo "$siblings" | jq -c '.'); do
                sibling_number=$(echo "$row" | jq -r '.number')
                if [[ "$sibling_number" == "$GITHUB_ISSUE_NUMBER" ]]; then
                    continue
                fi
                has_resolution=$(echo "$row" | jq '[.labels[].name | startswith("resolution:")] | any')
                if [[ "$has_resolution" != "true" ]]; then
                    all_resolved=false
                    break
                fi
            done
            if [[ "$all_resolved" == "true" ]]; then
                echo "All siblings of parent issue #$parent are resolved. Moving parent to Review."
                gh issue edit "$parent" --add-label "status: Review"
            fi
        fi

    fi
}

assigned() {
    # TODO: Will complete later (disabled below)
    echo "Handling assignment event for issue #$1"
    # $1 - issue number
    # Move to In Progress
    gh issue edit "$1" --add-label "status: In Progress"
    parent=$(get_parent)
    if [[ -n "$parent" && "$parent" != "null" ]]; then
        echo "Issue #$1 has parent issue #$parent. Moving parent to In Progress."
        gh issue edit "$parent" --add-label "status: In Progress"
    fi
    # If it has a parent, move that to In Progress as well
}
if [[ -z "$1" ]]; then
    event_json=$(cat)
else
    event_json="$1"
fi
# echo $event_json
action=$(echo $event_json | jq -r .action)
ticket=$(echo $event_json | jq -r .issue.number)

if [[ "$action" == "labeled" ]]; then
    label=$(echo $event_json | jq -r .label.name)
    labeled $ticket $label
elif [[ "$action" == "assigned" ]]; then
    echo "Assignment event functionality not implemented"
    # assigned $ticket
else
    echo "Unhandled action: $action"
    exit 0
fi
