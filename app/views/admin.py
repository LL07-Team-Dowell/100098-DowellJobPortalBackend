from .imports import *

# api for admin management starts here______________________
@method_decorator(csrf_exempt, name="dispatch")
class admin_create_jobs(APIView):
    def post(self, request):
        data = request.data
        error_message = "Job Creation failed"
        success_message = "Job Creation Successful"
        if not data:
            return Response(success=False, message=error_message, response="'request' parameters are not valid, they are None",status=status.HTTP_400_BAD_REQUEST)
        
        serializer = AdminSerializer(data=data)
        if not serializer.is_valid():
            error = {field_name: field_errors[0] if isinstance(field_errors, list) else [field_errors] for field_name, field_errors in serializer.errors.items()}
            return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)

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
            
        type_of_opening=["Group_Lead","Team_Lead"]
        if request.GET.get("type") == "is_internal":

            if (data.get("type_of_opening") in type_of_opening):
                field["is_internal"] = True
                field["type_of_opening"] = data.get("type_of_opening")
            else:
                error={'error': 'Pass type_of_opening as either Group_Lead or Team_Lead'}
                return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
            
        response = json.loads(dowellconnection(*jobs, "insert", field, update_field=None))
        #print(response,'=============')
        if response["isSuccess"] == True:
            return  Response(success=True, message=success_message, response=response,status=status.HTTP_201_CREATED)   
        return Response(success=False, message=error_message, response=response,status=status.HTTP_400_BAD_REQUEST)
                         
@method_decorator(csrf_exempt, name="dispatch")
class admin_create_associate_job(APIView):
    def post(self, request):
        data = request.data
        error_message = "Associate Job Creation failed"
        success_message = "Associate Job Creation Successful"
        if not data:
            return Response(success=False, message=error_message, response="'request' parameters are not valid, they are None",status=status.HTTP_400_BAD_REQUEST)
        
        serializer = regionalassociateSerializer(data=data)
        if not serializer.is_valid():
            error = {field_name: field_errors[0] if isinstance(field_errors, list) else [field_errors] for field_name, field_errors in serializer.errors.items()}
            return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)

        field = {
            "job_title": data.get("job_title"),
            "continent":data.get("continent"),
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
        
        response = json.loads(dowellconnection(*jobs, "insert", field, update_field=None))
        if response["isSuccess"] == True:
            return  Response(success=True, message=success_message, response=response,status=status.HTTP_201_CREATED) 
        return Response(success=False, message=error_message, response=response,status=status.HTTP_400_BAD_REQUEST)
     
@method_decorator(csrf_exempt, name="dispatch")
class admin_get_job(APIView):
    def get(self, request, document_id):
        error_message = "Job details do not exist"
        success_message = "Job details found"

        field={"_id":document_id,"data_type": "Real_Data"}
        response = json.loads(dowellconnection(*jobs, "fetch", field, update_field=None))
        if response["isSuccess"] == True:
            res= response["data"]
            if len(res) > 0:
                return Response(success=True, message=success_message, response=res,status=status.HTTP_200_OK)   
        return Response(success=False, message=error_message, response=res,status=status.HTTP_204_NO_CONTENT)

@method_decorator(csrf_exempt, name="dispatch")
class admin_get_jobs(APIView):
    def get(self, request, company_id):
        error_message = "Job details do not exist"
        success_message = "Job details found"
        field ={"company_id": company_id,"data_type": "Real_Data"}
        response = json.loads(dowellconnection(*jobs, "fetch", field, update_field=None))
        if response["isSuccess"] == True:
            res= response["data"]
            if len(res) > 0:
                return Response(success=True, message=success_message, response=res,status=status.HTTP_200_OK)   
        return Response(success=False, message=error_message, response=res,status=status.HTTP_204_NO_CONTENT)

class admin_get_deleted_jobs(APIView):
    def get(self, request, company_id):
        error_message = "Job details do not exist"
        success_message = "Job details found"
        field ={"company_id": company_id,"data_type": "Archived_Data"}
        response = json.loads(dowellconnection(*jobs, "fetch", field, update_field=None))
        if response["isSuccess"] == True:
            res= response["data"]
            if len(res) > 0:
                return Response(success=True, message=success_message, response=res,status=status.HTTP_200_OK)   
        return Response(success=False, message=error_message, response=res,status=status.HTTP_204_NO_CONTENT)

@method_decorator(csrf_exempt, name="dispatch")
class admin_update_jobs(APIView):
    def patch(self, request):
        data = request.data
        error_message = "Job failed to be updated"
        success_message = "Job successfully updated"
        if not data:
            error = "request parameters are not valid, they are None"
            if not data.get("document_id"):
                error="document id is not valid"
            return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
            
        field = {"_id": data.get("document_id")}
        response = json.loads(dowellconnection(*jobs, "update", field, update_field=data))
        if response["isSuccess"] == True:
            return  Response(success=True, message=success_message, response=response,status=status.HTTP_200_OK) 
        return Response(success=False, message=error_message, response=response,status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name="dispatch")
class admin_delete_job(APIView):
    def delete(self, request, document_id):
        error_message = "Job failed to be deleted"
        success_message = "Job successfully deleted"
        field = {"_id": document_id}
        update_field = {"data_type": "Archived_Data"}
        response = json.loads(dowellconnection(*jobs, "update", field, update_field))
        if response["isSuccess"] == True:
            return  Response(success=True, message=success_message, response=response,status=status.HTTP_200_OK) 
        return Response(success=False, message=error_message, response=response,status=status.HTTP_400_BAD_REQUEST)
     
# api for admin management ends here______________________
