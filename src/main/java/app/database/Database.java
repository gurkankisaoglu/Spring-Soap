package app.database;

import app.entities.Message;
import app.entities.User;

import javax.xml.datatype.XMLGregorianCalendar;
import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;

public class Database {

    Connection myConn;

    public Database() {

        try {
            this.myConn = DriverManager.getConnection("jdbc:mysql://localhost:3306/myusers?useUnicode=true&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=UTC", "root", "root");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public boolean loginControl(User user) throws SQLException {
        String username = user.getUsername();
        String password = user.getPassword();
        PreparedStatement myStmt = myConn.prepareStatement("SELECT * FROM u_table WHERE username=? and password=?");
        myStmt.setString(1,username);
        myStmt.setString(2,password);
        ResultSet myRes = myStmt.executeQuery();
        return myRes.isBeforeFirst();
    }

    public boolean isAdmin(String name) throws SQLException {
        PreparedStatement myStmt = myConn.prepareStatement("SELECT * FROM u_table WHERE username=?");
        myStmt.setString(1,name);
        ResultSet rSet = myStmt.executeQuery();
        int res = 0;
        while (rSet.next()){
            res = rSet.getInt("authority");
        }
        return res==1;
    }

    public boolean updateUser(String name,String changeIdentity, String newIdentity) throws IOException, SQLException {
        PreparedStatement myStmt = myConn.prepareStatement("UPDATE u_table SET "+changeIdentity+"=? WHERE username=?");
        myStmt.setString(1,newIdentity);
        myStmt.setString(2,name);
        return myStmt.executeUpdate()==1;
    }

    public ArrayList<User> getAll() throws SQLException, IOException {
        PreparedStatement myStmt = myConn.prepareStatement("SELECT * FROM u_table");
        ResultSet res = myStmt.executeQuery();
        ArrayList<User> returnValue = new ArrayList<>();
        while (res.next()){
            returnValue.add(new User(res.getString("username"),res.getString("password"),res.getString("email"),res.getString("gender"),res.getString("address"),res.getInt("authority")));
        }
        return returnValue;
    }

    public boolean deleteUser(String name) throws SQLException {
        PreparedStatement myStmt = myConn.prepareStatement("DELETE FROM u_table WHERE username=?");
        myStmt.setString(1,name);
        return myStmt.executeUpdate()==1;
    }

    public boolean createUser(User user) throws SQLException {
        String username = user.getUsername();
        String password = user.getPassword();
        String email = user.getEmail();
        String gender = user.getGender();
        String address = user.getAddress();
        int authority = user.getAuthority();
        PreparedStatement myStmt = myConn.prepareStatement("INSERT INTO u_table(username,password,email,gender,address,authority) " +
                "VALUES(?,?,?,?,?,?)");
        myStmt.setString(1,username);
        myStmt.setString(2,password);
        myStmt.setString(3,email);
        myStmt.setString(4,gender);
        myStmt.setString(5,address);
        myStmt.setInt(6,authority);
        return myStmt.executeUpdate()==1;
    }

    public boolean sendMail(Message msg) throws IOException, SQLException {
        String to=msg.getTo();
        String from=msg.getFrom();
        XMLGregorianCalendar date=msg.getDate();
        String message=msg.getText();
        PreparedStatement myStmt = myConn.prepareStatement("INSERT INTO m_table(sender,toSend,date,message) VALUES(?,?,?,?)");
        myStmt.setString(1,from);
        myStmt.setString(2,to);
        myStmt.setString(3, String.valueOf(date));
        myStmt.setString(4,message);
        if(myStmt.executeUpdate()==1) return true;
        else return false;

    }

    public ArrayList<Message> getInbox(String name) throws SQLException{
        PreparedStatement myStmt = myConn.prepareStatement("SELECT * FROM m_table WHERE to=?");
        myStmt.setString(1,name);
        ResultSet res = myStmt.executeQuery();
        ArrayList<Message> returnValue = new ArrayList<>();
        while (res.next()){
            returnValue.add(new Message(res.getString("sender"),res.getString("toSend"),res.getTime("date"),res.getString("message")));
        }
        return returnValue;
    }

    public ArrayList<Message> getOutbox(String name) throws SQLException {
        PreparedStatement myStmt = myConn.prepareStatement("SELECT * FROM m_table WHERE from=?");
        myStmt.setString(1,name);
        ResultSet res = myStmt.executeQuery();
        ArrayList<Message> returnValue = new ArrayList<>();
        while (res.next()){
            returnValue.add(new Message(res.getString("sender"),res.getString("toSend"),res.getTime("date"),res.getString("message")));
        }
        return returnValue;
    }

    public User get(String name) throws SQLException {
        PreparedStatement myStmt = myConn.prepareStatement("SELECT * from u_table");
        ResultSet res = myStmt.executeQuery();
        while (res.next()){
            if(res.getString("username")==name) {
                return new User(res.getString("username"),res.getString("password"),res.getString("email"),res.getString("gender"),res.getString("address"),res.getInt("authority"));
            }
        }
        return null;
    }

    public void addToSessionTable(String token, String s) throws SQLException {
        PreparedStatement myStmt = myConn.prepareStatement("INSERT INTO t_table VALUES(?,?)");
        myStmt.setString(1,token);
        myStmt.setString(2,s);
        myStmt.executeUpdate();
    }

    public boolean isActiveUser(String name,String token) throws SQLException {
        PreparedStatement myStmt = myConn.prepareStatement("SELECT * FROM t_table WHERE username=?");
        myStmt.setString(1,name);
        ResultSet res= myStmt.executeQuery();
        while (res.next()){
            if(res.getString("token")==token){
                return true;
            }
        }
        return false;
    }

    public boolean deleteFromSessionTable(String name) throws SQLException {
        PreparedStatement myStmt = myConn.prepareStatement("DELETE FROM t_table WHERE username=?");
        myStmt.setString(1,name);
        return myStmt.executeUpdate()==1;
    }
}
