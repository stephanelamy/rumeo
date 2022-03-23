#!/bin/sh

MESSAGE=$(cat z_commit_message.txt)
git commit -a -m "$MESSAGE"
git push
