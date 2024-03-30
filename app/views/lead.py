from .imports import *

# api for lead management starts here________________________
@method_decorator(csrf_exempt, name="dispatch")
class lead_hire_candidate(APIView):
    def post(self, request):
        data = request.data
        error_message = "Lead Hiring action failed"
        success_message = "candidate has been hired successfully"
        if not data:
            return Response(success=False, message=error_message, response="'request' parameters are not valid, they are None",status=status.HTTP_400_BAD_REQUEST)
        
        serializer = HireSerializer(data=data)
        if not serializer.is_valid():
            error = {field_name: field_errors[0] if isinstance(field_errors, list) else [field_errors] for field_name, field_errors in serializer.errors.items()}
            return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)

        field = {"_id": data.get("document_id"),}
        update_field = {
            "teamlead_remarks": data.get("teamlead_remarks"),
            "status": data.get("status"),
            "hired_on": data.get("hired_on"),
        }
        insert_to_lead_report = {
            "event_id": get_event_id()["event_id"],
            "applicant": data.get("applicant"),
            "teamlead_remarks": data.get("teamlead_remarks"),
            "status": data.get("status"),
            "company_id": data.get("company_id"),
            "data_type": data.get("data_type"),
            "hired_on": data.get("hired_on"),
        }
        c_r = []
        l_r = []

        def call_dowellconnection(*args):
            d = dowellconnection(*args)
            #print(d, *args, "=======================")
            if "candidate_report" in args:
                c_r.append(d)
            if "lead_report" in args:
                l_r.append(d)
            
        arguments=[(*candidate_management_reports, "update", field, update_field),
                   (*lead_management_reports,"insert",insert_to_lead_report,update_field,)]
        
        threads=[]
        for arg in arguments:
            thread = threading.Thread(target=call_dowellconnection,args=(arg))
            thread.start()
            threads.append(thread)

        for thread in threads:
            thread.join()

        # Response block
        error ='Thread Execution failed'
        if all(not thread.is_alive() for thread in threads):
            error =json.loads(l_r[0])
            # print(json.loads(l_r))
            if json.loads(l_r[0])["isSuccess"] == True:
                return  Response(success=True, message=success_message, response=json.loads(c_r[0]),status=status.HTTP_201_CREATED)   
        return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name="dispatch")
class lead_rehire_candidate(APIView):
    def post(self, request):
        data = request.data
        error_message = "Lead Rehiring action failed"
        success_message = "Candidate has been rehired successfully"
        if not data:
            return Response(success=False, message=error_message, response="'request' parameters are not valid, they are None",status=status.HTTP_400_BAD_REQUEST)
        
        serializer = RehireSerializer(data=data)
        if not serializer.is_valid():
            error = {field_name: field_errors[0] if isinstance(field_errors, list) else [field_errors] for field_name, field_errors in serializer.errors.items()}
            return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)

        field = {"_id": data.get("document_id")}
        update_field = {
            "rehire_remarks": data.get("rehire_remarks"),
            "status": "rehire",
            "rehired_on": data.get("rehired_on"),
        }
        response = json.loads(dowellconnection(*candidate_management_reports, "update", field, update_field))
        if response["isSuccess"] == True:
            return  Response(success=True, message=success_message, response=response,status=status.HTTP_201_CREATED)   
        return Response(success=False, message=error_message, response=response,status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name="dispatch")
class lead_reject_candidate(APIView):
    def post(self, request):
        data = request.data
        error_message = "candidate rejection action failed"
        success_message = "candidate has been rejected successfully"
        serializer = RejectSerializer(data=data)
        if not serializer.is_valid():
            error = {field_name: field_errors[0] if isinstance(field_errors, list) else [field_errors] for field_name, field_errors in serializer.errors.items()}
            return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)

        field = {"_id": data.get("document_id"),}
        update_field = {
            "reject_remarks": data.get("reject_remarks"),
            "status": "Rejected",
            "rejected_on": data.get("rejected_on"),
            "data_type": data.get("data_type"),
        }
        insert_to_lead_report = {
            "company_id": data.get("company_id"),
            "applicant": data.get("applicant"),
            "username": data.get("username"),
            "reject_remarks": data.get("reject_remarks"),
            "status": "Rejected",
            "data_type": data.get("data_type"),
            "rejected_on": data.get("rejected_on"),
        }
        c_r = []
        h_r = []
        l_r = []

        def call_dowellconnection(*args):
            d = dowellconnection(*args)
            arg = args
            #print(d, *args, "=======================")
            if "candidate_report" in args:
                c_r.append(d)
            if "hr_report" in args:
                h_r.append(d)
            if 'lead_report' in args:
                l_r.append(d)

        arguments=[(*candidate_management_reports, "update", field, update_field),
                   (*hr_management_reports, "update", field, update_field),
                   (*lead_management_reports,"insert",insert_to_lead_report,update_field,)]

        threads=[]
        for arg in arguments:
            thread=threading.Thread(target=call_dowellconnection,args=(arg))
            thread.start()
            threads.append(thread)
        for thread in threads:
            thread.join()

        error ='Thread Execution failed'
        if (not thread.is_alive() for thread in threads):
            error =json.loads(l_r[0])
            if json.loads(l_r[0])["isSuccess"] == True:
                print("True")
                return  Response(success=True, message=success_message, response=json.loads(c_r[0]),status=status.HTTP_201_CREATED)      
        return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
  
# api for lead management ends here________________________

