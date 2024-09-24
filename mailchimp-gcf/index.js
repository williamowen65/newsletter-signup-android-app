import functions from '@google-cloud/functions-framework'
import mailchimp from "@mailchimp/mailchimp_marketing"
import { md5 } from 'js-md5'


functions.http('mailchimp', (req, res) => {

    let data = JSON.parse(JSON.stringify(req.body.queue))

    console.log(
        "\n\nSending Mailchimp new subscribers  \n\n",
        JSON.stringify(req.body, null, 2))

    const config = {
        apiKey: process.env.MAILCHIMP_API_KEY,
        server: process.env.MAILCHIMP_SERVER_PREFIX,
    }


    // Connect to mailChimp
    mailchimp.setConfig(config);

    batchAddMailChimpContacts(data, req.body.eventName)

    async function batchAddMailChimpContacts(contactList, eventName) {
        contactList = contactList.map(d => {
            const name = d.name.split(" ")
            return {
                email_address: d.email,
                email_type: 'html',
                status: "subscribed",
                merge_fields: {
                    FNAME: name[0],
                    LNAME: name[1]
                },
                tags: [eventName]
            }
        })



        try {
            const response = await mailchimp.lists.batchListMembers(process.env.MAINLIST_ID, {
                members: contactList,
            }, {
                skip_merge_validation: true
            });
            console.log("MailChimp_Response", JSON.stringify(response, null, 2));

            const existingMembersToUpdate = response.errors.map(e => {
                if (e.error_code == 'ERROR_CONTACT_EXISTS') {
                    e.emailHash = md5(e.email_address.toLowerCase())
                    return e
                }
            }).filter(Boolean)

            await updateTags(existingMembersToUpdate)


            res.send({
                mailchimpResponse: {
                    new_members_count: response.new_members.length,
                    updated_member_count: existingMembersToUpdate.length
                }
            });

        } catch (error) {
            console.log("error: ", error)

            res.send({
                mailchimpResponse: {
                    error,
                    test: "There was an error"
                }
            })
        }


        async function updateTags(listToUpdate) {
            listToUpdate.forEach(async d => {
                await mailchimp.lists.updateListMemberTags(
                    process.env.MAINLIST_ID,
                    d.emailHash,
                    { tags: [{ name: req.body.eventName, status: "active" }] }
                );
            })
        }
    }

});
