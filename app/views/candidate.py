from .imports import *

# api for candidate management starts here______________________
@method_decorator(csrf_exempt, name="dispatch")
class candidate_apply_job(APIView):
    def duplicate_check(self, applicant_email):
        data = self.request.data
        candidate_field = {
            "job_number": data.get("job_number"),
            "applicant_email": applicant_email,
        }
        candidate_report = json.loads(dowellconnection(*candidate_management_reports, "fetch", candidate_field, update_field=None))["data"]
        # print(candidate_report)
        if len(candidate_report) > 0:
            return False
        else:
            return True

    def is_eligible_to_apply(self, applicant_email):
        data = self.request.data
        field = {
            "applicant": data.get("applicant"),
            "applicant_email": applicant_email,
            "username": data.get("username"),
        }
        applicant = dowellconnection(*hr_management_reports, "fetch", field, update_field=None)

        if applicant is not None:
            rejected_dates = [
                datetime.strptime(item["rejected_on"], "%m/%d/%Y %H:%M:%S")
                for item in json.loads(applicant)["data"]
            ]
            if len(rejected_dates) >= 1:
                rejected_on = max(rejected_dates)
                if rejected_on:
                    three_months_after = rejected_on + relativedelta(months=3)
                    current_date = datetime.today()
                    if (current_date >= three_months_after or current_date == datetime.today()):
                        return True
                return True
            else:
                return True

        return False

    def post(self, request):
        data = request.data
        error_message = "Job application failed"
        success_message = "Job application successful"
        if not data:
            return Response(success=False, message=error_message, response="'request' parameters are not valid, they are None",status=status.HTTP_400_BAD_REQUEST)
        applicant_email = data.get("applicant_email")
        if not self.is_eligible_to_apply(applicant_email):
            return Response(
                success=False,
                message="Not eligible to apply yet.",
                response={
                        "applicant": data.get("applicant"),
                        "applicant_email": data.get("applicant_email"),
                        "username": data.get("username"),
                    },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not self.duplicate_check(applicant_email):
            return Response(
                success=False,
                message="Duplicate entry found.",
                response={
                        "applicant": data.get("applicant"),
                        "applicant_email": data.get("applicant_email"),
                        "username": data.get("username"),
                    },status=status.HTTP_400_BAD_REQUEST,
            )
            
        speed_test_response= check_speed_test(applicant_email)
        if speed_test_response["success"] == False:
            return Response( success=False, message=error_message,response=speed_test_response["message"], status=status.HTTP_400_BAD_REQUEST)
        
        field = {
            "eventId": get_event_id()["event_id"],
            "job_number": data.get("job_number"),
            "job_title": data.get("job_title"),
            "applicant": data.get("applicant"),
            "applicant_email": data.get("applicant_email"),
            "feedBack": data.get("feedBack"),
            "freelancePlatform": data.get("freelancePlatform"),
            "freelancePlatformUrl": data.get("freelancePlatformUrl"),
            "academic_qualification_type": data.get("academic_qualification_type"),
            "academic_qualification": data.get("academic_qualification"),
            "country": data.get("country"),
            "job_category": data.get("job_category"),
            "agree_to_all_terms": data.get("agree_to_all_terms"),
            "internet_speed": speed_test_response['internet_speed'],
            "other_info": data.get("other_info"),
            "project": "",
            "status": "Pending",
            "hr_remarks": "",
            "teamlead_remarks": "",
            "rehire_remarks": "",
            "server_discord_link": "https://discord.gg/Qfw7nraNPS",
            "product_discord_link": "",
            "payment": data.get("payment"),
            "company_id": data.get("company_id"),
            "company_name": data.get("company_name"),
            "username": data.get("username"),
            "portfolio_name": data.get("portfolio_name"),
            "data_type": data.get("data_type"),
            "user_type": data.get("user_type"),
            "scheduled_interview_date": "",
            "application_submitted_on": data.get("application_submitted_on"),
            "shortlisted_on": "",
            "selected_on": "",
            "hired_on": "",
            "onboarded_on": "",
            "module": data.get("module"),
            "payment_requested": False,
            "current_payment_request_status": "",
            "candidate_certificate":data.get("candidate_certificate")
        }
        serializer = CandidateSerializer(data=field)
        if not serializer.is_valid():
            error = {field_name: field_errors[0] if isinstance(field_errors, list) else [field_errors] for field_name, field_errors in serializer.errors.items()}
            return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
            
        
        """Response block"""   
        response = json.loads(dowellconnection(*candidate_management_reports, "insert", field, update_field=None))
        if response["isSuccess"] == True:
            return Response(success=True,message=success_message,response=response,status=status.HTTP_201_CREATED)
        return Response(success=False,message=error_message,response=response,status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name="dispatch")
class candidate_get_job_application(APIView):
    def get(self, request, company_id):
        error_message = "No Job Applications Found"
        success_message = "List of Job Applications"
        field = {"company_id": company_id,"data_type": "Real_Data"}
        response = json.loads(dowellconnection(*candidate_management_reports, "fetch", field, update_field=None))
        error="None has been uploaded with the company id provided"
        if response["isSuccess"] == True:
            if len(response["data"]) > 0:
                return  Response(success=True, message=success_message, response=response["data"],status=status.HTTP_201_CREATED)   
        return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
               
@method_decorator(csrf_exempt, name="dispatch")
class get_candidate_application(APIView):
    def get(self, request, document_id):
        error_message = "No Candidates Found"
        success_message = "List of Candidates"
        
        response = json.loads(dowellconnection(*candidate_management_reports, "fetch", {"_id": document_id}, update_field=None))

        error="No candidates with the document id provided"
        if response["isSuccess"] == True:
            if len(response["data"]) > 0:
                return  Response(success=True, message=success_message, response=response["data"],status=status.HTTP_201_CREATED)   
        return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
               
@method_decorator(csrf_exempt, name="dispatch")
class get_all_onboarded_candidate(APIView):
    def get(self, request, company_id):
        error_message = "No Onboarded Candidates Found"
        success_message = "List of Onboarded Candidates"
        field = {"company_id": company_id, "status": "hired"}
        response = json.loads(dowellconnection(*candidate_management_reports, "fetch", field, update_field=None))

        error="No onboarded candidates with the company id provided"
        if response["isSuccess"] == True:
            if len(response["data"]) > 0:
                return  Response(success=True, message=success_message, response=response["data"],status=status.HTTP_201_CREATED)   
        return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
            
@method_decorator(csrf_exempt, name="dispatch")
class get_all_removed_candidate(APIView):
    def get(self, request, company_id):
        error_message = "No Removed Candidates Found"
        success_message = "List of Removed Candidates"
        field = {"company_id": company_id, "status": "Removed"}
        response = json.loads(dowellconnection(*candidate_management_reports, "fetch", field, update_field=None))

        error="No removed candidates with company id provided"
        if response["isSuccess"] == True:
            if len(response["data"]) > 0:
                return  Response(success=True, message=success_message, response=response["data"],status=status.HTTP_201_CREATED)   
        return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
            
@method_decorator(csrf_exempt, name="dispatch")
class get_all_hired_candidate(APIView):
    def get(self, request, company_id):
        error_message = "No Hired Candidates Found"
        success_message = "List of Hired Candidates"
        field = {"company_id": company_id, "status": "hired"}
        response = json.loads(dowellconnection(*candidate_management_reports, "fetch", field, update_field=None))

        error="No hired candidates with the company id provided"
        if response["isSuccess"] == True:
            if len(response["data"]) > 0:
                candidates=[{"_id":res["_id"],
                    "applicant":res["applicant"],
                    "username":res["username"],
                    "applicant_email":res["applicant_email"]} for res in response["data"]]
                return  Response(success=True, message=success_message, response=candidates,status=status.HTTP_201_CREATED)   
        return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
                   
@method_decorator(csrf_exempt, name="dispatch")
class get_all_renew_contract_candidate(APIView):
    def get(self, request, company_id):
        error_message = "No Renewed Candidates Found"
        success_message = "List of Renewed Candidates"
        field = {"company_id": company_id, "status": "renew_contract"}
        
        response = json.loads(dowellconnection(*candidate_management_reports, "fetch", field, update_field=None))

        error="No Renewed candidates with the company id provided"
        if response["isSuccess"] == True:
            if len(response["data"]) > 0:
                candidates=[{"_id":res["_id"],
                    "applicant":res["applicant"],
                    "username":res["username"],
                    "applicant_email":res["applicant_email"]} for res in response["data"]]
                return  Response(success=True, message=success_message, response=candidates,status=status.HTTP_201_CREATED)   
        return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
            
@method_decorator(csrf_exempt, name="dispatch")
class delete_candidate_application(APIView):
    def delete(self, request, document_id):
        error_message = "Successfully Deleted Application"
        success_message = "Failed to Delete Application"
        field = {"_id": document_id}
        update_field = {"data_type": "Archived_Data"}
        
        response = json.loads(dowellconnection(*candidate_management_reports, "update", field, update_field=update_field))

        if response["isSuccess"] == True:
            return  Response(success=True, message=success_message, response=response,status=status.HTTP_201_CREATED)   
        return Response(success=False, message=error_message, response=response,status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name="dispatch")
class get_all_deleted_candidate_applications(APIView):
    def get(self, request, company_id):
        error_message = "No Deleted applications Found"
        success_message = "List of Deleted applications"
        field = {"company_id": company_id, "data_type": "Archived_Data"}
        
        response = json.loads(dowellconnection(*candidate_management_reports, "fetch", field, update_field=None))

        error="No Deleted applications with the company id provided"
        if response["isSuccess"] == True:
            if len(response["data"]) > 0:
                return  Response(success=True, message=success_message, response=response["data"],status=status.HTTP_201_CREATED)   
        return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
                
@method_decorator(csrf_exempt, name="dispatch")
class update_candidates_application(APIView):
    def post(self, request):
        request_type = request.GET.get("type")
        if request_type == "update_user_id":
            return self.update_user_id(request)
        else:
            return Response(success=False, message="Failed to update data application", response="Invalid request type", status=status.HTTP_400_BAD_REQUEST)
         
    def update_user_id(self,request):
        data = request.data
        error_message = "Failed to update user id"
        success_message = "Successfully updated user id"
        if not data:
            return Response(success=False, message=error_message, response="'request' parameters are not valid, they are None",status=status.HTTP_400_BAD_REQUEST)
        
        serializer=UpdateUserIdSerializer(data=data)
        if not serializer.is_valid():
            error = {field_name: field_errors[0] if isinstance(field_errors, list) else [field_errors] for field_name, field_errors in serializer.errors.items()}
            return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
  
        field = {"_id": data.get("application_id")}
        update_field = {"user_id":data.get("user_id")}

        response = json.loads(dowellconnection(*candidate_management_reports, "update", field, update_field))

        if response["isSuccess"] == True:
            return  Response(success=True, message=success_message, response=response,status=status.HTTP_201_CREATED) 
        return Response(success=False, message=error_message, response=response,status=status.HTTP_400_BAD_REQUEST)
        
# api for candidate management ends here______________________
