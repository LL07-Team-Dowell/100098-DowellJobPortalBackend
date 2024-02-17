from .imports import *

# api for admin management starts here______________________
@method_decorator(csrf_exempt, name="dispatch")
class admin_create_jobs(APIView):
    def post(self, request):
        data = request.data
        # continue create job api-----
        field = {
            "eventId": get_event_id()["event_id"],
            "job_number": data.get("job_number"),
            "job_title": data.get("job_title"),
            "description": data.get("description"),
            "skills": data.get("skills"),
            "qualification": data.get("qualification"),
            "time_interval": data.get("time_interval"),
            "job_category": data.get("job_category"),
            "type_of_job": data.get("type_of_job"),
            "payment": data.get("payment"),
            "is_active": data.get("is_active", False),
            "general_terms": data.get("general_terms"),
            "module": data.get("module"),
            "technical_specification": data.get("technical_specification"),
            "workflow_terms": data.get("workflow_terms"),
            "payment_terms": data.get("payment_terms"),
            "other_info": data.get("other_info"),
            "company_id": data.get("company_id"),
            "data_type": data.get("data_type"),
            "created_by": data.get("created_by"),
            "created_on": data.get("created_on"),
            "paymentInterval": data.get("paymentInterval"),
            "type_of_opening": data.get("type_of_opening"),
            "country": request.data.get("country"),
            "city": request.data.get("city"),
            "continent": request.data.get("continent"),
        }
        type_request = request.GET.get("type")
        if type_request == "is_internal":
            if (
                data.get("type_of_opening") == "Group_Lead"
                or data.get("type_of_opening") == "Team_Lead"
                or data.get("type_of_opening") == None
            ):
                field["is_internal"] = True
                field["type_of_opening"] = data.get("type_of_opening")
            else:
                return Response(
                    {
                        "message": "Job creation was unsuccessful.",
                        "response": " Pass 'type_of_opening' as either 'Group_Lead' or 'Team_Lead'",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        update_field = {"status": "nothing to update"}
        serializer = AdminSerializer(data=field)
        if serializer.is_valid():
            response = dowellconnection(*jobs, "insert", field, update_field)
            if json.loads(response)["isSuccess"] == True:
                return Response(
                    {
                        "message": "Job creation was successful.",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Job creation has failed",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name="dispatch")
class associate_job(APIView):
    def post(self, request):
        data = request.data
        # continue create job api-----
        field = {
            "job_title": data.get("job_title"),
            "country": data.get("country"),
            "city": data.get("city"),
            "is_active": data.get("is_active"),
            "job_category": "regional_associate",
            "job_number": data.get("job_number"),
            "skills": data.get("skills"),
            "description": data.get("description"),
            "qualification": data.get("qualification"),
            "payment": data.get("payment"),
            "company_id": data.get("company_id"),
            "data_type": data.get("data_type"),
            "paymentInterval": data.get("paymentInterval"),
        }
        update_field = {"status": "nothing to update"}

        serializer = regionalassociateSerializer(data=field)
        if serializer.is_valid():
            response = dowellconnection(*jobs, "insert", field, update_field)
            if json.loads(response)["isSuccess"] == True:
                return Response(
                    {
                        "message": "Job creation was successful.",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "Job creation has failed",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name="dispatch")
class admin_get_job(APIView):
    def get(self, request, document_id):
        field = {"_id": document_id}
        update_field = {"status": "nothing to update"}
        response = dowellconnection(*jobs, "fetch", field, update_field)
        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": "Job details do not exist",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {"message": "List of jobs.", "response": json.loads(response)},
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {
                    "message": "There are no jobs with this id",
                    "response": json.loads(response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )

@method_decorator(csrf_exempt, name="dispatch")
class admin_get_all_jobs(APIView):
    def get(self, request, company_id):
        field = {
            "company_id": company_id,
        }
        update_field = {"status": "nothing to update"}
        response = dowellconnection(*jobs, "fetch", field, update_field)
        if json.loads(response)["isSuccess"] == True:
            if len(json.loads(response)["data"]) == 0:
                return Response(
                    {
                        "message": "There is no job with the company id",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
            else:
                return Response(
                    {"message": "List of jobs.", "response": json.loads(response)},
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {"message": "There is no jobs", "response": json.loads(response)},
                status=status.HTTP_204_NO_CONTENT,
            )


# update the jobs
@method_decorator(csrf_exempt, name="dispatch")
class admin_update_jobs(APIView):
    def patch(self, request):
        data = request.data
        if data:
            field = {"_id": data.get("document_id")}
            update_field = data
            response = dowellconnection(*jobs, "update", field, update_field)
            # print(response)
            if json.loads(response)["isSuccess"] == True:
                return Response(
                    {
                        "message": "Job update was successful",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "message": "Job update has failed",
                        "response": json.loads(response),
                    },
                    status=status.HTTP_204_NO_CONTENT,
                )
        else:
            return Response(
                {"message": "Parameters are not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


# delete the jobs


@method_decorator(csrf_exempt, name="dispatch")
class admin_delete_job(APIView):
    def delete(self, request, document_id):
        field = {"_id": document_id}
        update_field = {"data_type": "archive_data"}
        response = dowellconnection(*jobs, "update", field, update_field)
        # print(response)
        if json.loads(response)["isSuccess"] == True:
            return Response(
                {"message": "Job successfully deleted"}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {
                    "message": "Job not successfully deleted",
                    "response": json.loads(response),
                },
                status=status.HTTP_204_NO_CONTENT,
            )
# api for admin management ends here______________________
