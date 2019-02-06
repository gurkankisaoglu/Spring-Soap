package app.endpoints;

import app.controller.TokenGenerator;
import app.entities.User;
import app.repos.UserRepository;
import app.response_request.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.io.IOException;
import java.sql.SQLException;

@Endpoint
public class UserEndpoint {
    private static final String NAMESPACE_URI = "http://spring.io/guides/gs-producing-web-service";

    private UserRepository userRepository;
    TokenGenerator generator = new TokenGenerator();

    @Autowired
    public UserEndpoint(UserRepository userRepository) {
        this.userRepository= userRepository;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getUserRequest")
    @ResponsePayload
    public GetUserResponse getUser(@RequestPayload GetUserRequest request) throws IOException, SQLException {
        GetUserResponse response = new GetUserResponse();
        response.setUser(userRepository.database.getAll());

        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "sendLoginRequest")
    @ResponsePayload
    public SendLoginResponse getLoginInfo(@RequestPayload SendLoginRequest request) throws IOException, SQLException {
        SendLoginResponse response = new SendLoginResponse();
        String[] splited = request.getLoginInfo().split("\\s+");

        User user=new User(splited[0],splited[1]);

        if(userRepository.loginControl(user)){
            response.setResultInfo("success");
            userRepository.initializeUser(user);
            String token = generator.generateToken();
            userRepository.database.addToSessionTable(token,splited[0]);
            response.setToken(token);
        }else{
            response.setResultInfo("failed");
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "sendLogoutRequest")
    @ResponsePayload
    public SendLogoutResponse getLogoutInfo(@RequestPayload SendLogoutRequest request) throws IOException, SQLException {
        SendLogoutResponse response = new SendLogoutResponse();
        String name = request.getLogoutInfo();
        if(userRepository.database.deleteFromSessionTable(name)){
            response.setResultInfo("success");
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "sendAdminRequest")
    @ResponsePayload
    public SendAdminResponse getUsername(@RequestPayload SendAdminRequest request) throws SQLException {
        SendAdminResponse response = new SendAdminResponse();
        String usrname = request.getUsername();
        if(userRepository.isAdmin(usrname)){
            response.setResultInfo("Admin");
        }else{
            response.setResultInfo("Not admin");
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getCreateRequest")
    @ResponsePayload
    public GetCreateResponse getUser(@RequestPayload GetCreateRequest request) throws SQLException {
        GetCreateResponse response = new GetCreateResponse();
        User usr = new User(request.getUsername(),request.getPassword(),request.getEmail(),request.getGender(),request.getAddress(),request.getAuthority());
        if(!userRepository.database.isActiveUser(request.getCurrentUser(),request.getToken())){
            response.setResultInfo("cannot create");
        }
        if(userRepository.createUser(usr)){
            response.setResultInfo("created");
        }else{
            response.setResultInfo("cannot create");
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getUpdateRequest")
    @ResponsePayload
    public GetUpdateResponse getUser(@RequestPayload GetUpdateRequest request) throws IOException, SQLException {
        GetUpdateResponse response = new GetUpdateResponse();
        String name = request.getUsername();
        String changedIdentity = request.getIdentity();
        String newIdentity = request.getNewIdentity();
        if(userRepository.updateUser(name,changedIdentity,newIdentity)){
            response.setResultInfo("updated");
        }else{
            response.setResultInfo("cannot update");
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getDeleteRequest")
    @ResponsePayload
    public GetDeleteResponse getUser(@RequestPayload GetDeleteRequest request) throws IOException, SQLException {
        GetDeleteResponse response = new GetDeleteResponse();
        String name = request.getUsername();
        if(!userRepository.database.isActiveUser(request.getCurrentUser(),request.getToken())){
            response.setResultInfo("cannot delete");
        }
        if(userRepository.deleteUser(name)){
            response.setResultInfo("deleted");
        }else{
            response.setResultInfo("cannot delete");
        }
        return response;
    }
}