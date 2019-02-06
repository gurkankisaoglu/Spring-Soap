package app.endpoints;

import app.entities.Message;
import app.repos.MessageRepository;
import app.response_request.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.io.IOException;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

@Endpoint
public class MessageEndpoint {
    private static final String NAMESPACE_URI = "http://spring.io/guides/gs-producing-web-service";

    private MessageRepository messageRepository;

    @Autowired
    public MessageEndpoint(MessageRepository messageRepository) {
        this.messageRepository= messageRepository;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getInboxRequest")
    @ResponsePayload
    public GetInboxResponse getMessage(@RequestPayload GetInboxRequest request) throws SQLException {
        GetInboxResponse response = new GetInboxResponse();
        if(!messageRepository.database.isActiveUser(request.getCurrentUser(),request.getToken())){
            response.setMessage(null);
            return response;
        }
        response.setMessage(messageRepository.findInSent(request.getTo()));

        return response;
    }
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getOutboxRequest")
    @ResponsePayload
    public GetOutboxResponse getMessage(@RequestPayload GetOutboxRequest request) throws SQLException {
        GetOutboxResponse response = new GetOutboxResponse();
        if(!messageRepository.database.isActiveUser(request.getCurrentUser(),request.getToken())){
            response.setMessage(null);
            return response;
        }
        response.setMessage(messageRepository.findInReceived(request.getFrom()));

        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "sendMailRequest")
    @ResponsePayload
    public SendMailResponse getMessage(@RequestPayload SendMailRequest request) throws IOException, SQLException {
        SendMailResponse response = new SendMailResponse();
        if(!messageRepository.database.isActiveUser(request.getCurrentUser(),request.getToken())){
            response.setResultInfo(null);
            return response;
        }
        String[] splited = request.getMessageInfo().split("\\s+");

        DateFormat df = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
        Date today = Calendar.getInstance().getTime();


        Message msg = new Message(splited[0],splited[1], Calendar.getInstance().getTime() ,splited[2]);
        if(messageRepository.sendMail(msg)){
            response.setResultInfo("success");
        }else{
            response.setResultInfo("failed");
        }
        return response;
    }




}