









Private Function GetPrintOrderDetails(ByVal ChildOrderID As String)

    Dim Details(4)
    Dim RecipientName = ""
    Dim SendersName = ""
    Dim OrderNumber = ""
    Dim Instructions = ""
    Dim BranchName = ""

    Using sqlconnection As SqlConnection = New SqlConnection() 
    With {.ConnectionString = ConfigurationManager.ConnectionStrings("PVConnectionString").ConnectionString}

    Dim sqlcommand = New SqlCommand() 
    With {.Connection = sqlconnection, .CommandText = 
    ("SELECT *  FROM  BranchOrders WHERE  (OrderID  = @OrderID ) ")}
        
    sqlcommand.Parameters.Add(New SqlParameter("@OrderID ", SqlDbType.UniqueIdentifier, 
    16, "OrderID ")).Value = New Guid(ChildOrderID.ToString)
        
    sqlconnection.Open()
        
    Dim dreader1 As SqlDataReader = sqlcommand.ExecuteReader(CommandBehavior.SingleRow)
        
    If dreader1.Read() Then
        If dreader1("SytemOrderNumber") IsNot DBNull.Value Then OrderNumber = (dreader1("SytemOrderNumber"))
        If dreader1("OwnerID") IsNot DBNull.Value Then SendersName = GetName(dreader1("OwnerID").ToString)
        If dreader1("RecipientID") IsNot DBNull.Value Then RecipientName = GetName(dreader1("RecipientID").ToString)
        If dreader1("Instructions") IsNot DBNull.Value Then Instructions = (dreader1("Instructions"))
        If dreader1("RecipientBranchID") IsNot DBNull.Value Then BranchName = GetBranchName(dreader1("RecipientBranchID"))
    End If
    
    sqlconnection.Close()
    End Using

    Details(0) = RecipientName
    Details(1) = SendersName
    Details(2) = OrderNumber
    Details(3) = Instructions
    Details(4) = BranchName

    Return Details

End Function















Shared Function GetPackageName(ByVal PackageID As String) As String
    Try
        Dim Package = ""
        Dim ConString = (HttpContext.Current.Session("ArchiveConectionString"))
        Using sqlconnection As SqlConnection = New SqlConnection() With {.ConnectionString = (ConString)}
            Dim sqlcommand As SqlCommand = New SqlCommand() With {.Connection = sqlconnection, .CommandText = ("Select PackageName From Packages  WHERE  (PackageID = @PackageID)")}
            sqlcommand.Parameters.Add(New SqlParameter("@PackageID", SqlDbType.UniqueIdentifier, 16, "PackageID")).Value = New Guid(PackageID.ToString)

            sqlconnection.Open()
            Dim dreader1 As SqlDataReader = sqlcommand.ExecuteReader(CommandBehavior.SingleRow)
            If dreader1.Read() Then
                If dreader1("PackageName") IsNot DBNull.Value Then Package = Trim(dreader1("PackageName"))
            End If
            sqlconnection.Close()
        End Using
        Return Package
    Catch ex As Exception
        log.ErrorLog(ex)
    End Try
End Function
Private Function GetDocNumberAndRev(ByVal DocumentID As String) As String
    Try
        Dim Doc = ""
        Dim ConString = (Session("ArchiveConectionString"))
        Using sqlconnection As SqlConnection = New SqlConnection() With {.ConnectionString = (ConString)}
            Dim sqlcommand As SqlCommand = New SqlCommand() With {.Connection = sqlconnection, .CommandText = (String.Format("Select DocumentNumber,Rev From [ProjectIndex{0}]  WHERE  (DocumentID = @DocumentID)", Session("ArchiveID")))}
            sqlcommand.Parameters.Add(New SqlParameter("@DocumentID", SqlDbType.UniqueIdentifier, 16, "DocumentID")).Value = New Guid(DocumentID.ToString)

            sqlconnection.Open()
            Dim dreader1 As SqlDataReader = sqlcommand.ExecuteReader(CommandBehavior.SingleRow)
            If dreader1.Read() Then
                If dreader1("DocumentNumber") IsNot DBNull.Value Then Doc = Trim(dreader1("DocumentNumber"))
                If dreader1("Rev") IsNot DBNull.Value Then Doc += " - " & Trim(dreader1("Rev"))
            End If
            sqlconnection.Close()
        End Using
        Return Doc
    Catch ex As Exception
        log.ErrorLog(ex)
    End Try
End Function


















Shared Function GetPackageNumber(ByVal PackageID As String)
    Try
        Dim Name(2)
        If PackageID <> "" Then
            Using sqlconnection As SqlConnection = New SqlConnection() With {.ConnectionString = ((HttpContext.Current.Session("ArchiveConectionString").ToString))}
                Dim sqlcommand As SqlCommand = New SqlCommand() With {.Connection = sqlconnection, .CommandText = ("Select * From Packages Where (PackageID=@PackageID)")}
                sqlcommand.Parameters.Add(New SqlParameter("@PackageID", SqlDbType.UniqueIdentifier, 16, "PackageID")).Value = New Guid((PackageID.ToString))
                sqlconnection.Open()
                Dim dreader1 As SqlDataReader = sqlcommand.ExecuteReader(CommandBehavior.SingleRow)
                If dreader1.Read() Then
                    If dreader1("PackageNumber") IsNot DBNull.Value Then Name(0) = (dreader1("PackageNumber").ToString) & " - "
                    If dreader1("PackageName") IsNot DBNull.Value Then Name(1) += Trim(dreader1("PackageName").ToString)
                Else
                    Name(0) = ""
                    Name(1) = ""
                End If
                sqlconnection.Close()
            End Using
        Else

        End If
        Using sqlconnection2 As SqlConnection = New SqlConnection() With {.ConnectionString = ((HttpContext.Current.Session("ArchiveConectionString").ToString))}
            Dim sqlcommand2 As SqlCommand = New SqlCommand() With {.Connection = sqlconnection2, .CommandText = "SELECT SystemUserID FROM PackageUsers WHERE (PackageID = @PackageID)"}
            sqlcommand2.Parameters.Add(New SqlParameter("@PackageID", SqlDbType.UniqueIdentifier, 16, "PackageID")).Value = New Guid((PackageID.ToString))
            sqlconnection2.Open()
            Dim dreader2 As SqlDataReader = sqlcommand2.ExecuteReader '(CommandBehavior.SequentialAccess)
            Dim RecipientID
            Name(2) = ChrW(13) & ChrW(10)
            While dreader2.Read()
                If dreader2("SystemUserID") IsNot DBNull.Value Then RecipientID = dreader2("SystemUserID").ToString
                Name(2) += IssueControl.GetName(RecipientID) & " - "
                Name(2) += IssueControl.GetCompany(RecipientID) & " - "
                Name(2) += IssueControl.GetEmail(RecipientID) & " - "
                Name(2) += IssueControl.GetMobile(RecipientID) & ChrW(13) & ChrW(10)

            End While
            sqlconnection2.Close()
        End Using

        Return Name
    Catch ex As Exception
        log.ErrorLog(ex)
end function













Shared Function GetArchiveIssueNumber(ByVal IssueID As String)
    Try
        Dim Name(5)
        If IssueID <> "" Then
            Dim Type = 0
            Using sqlconnection As SqlConnection = New SqlConnection() With {.ConnectionString = ConfigurationManager.ConnectionStrings("PVConnectionString").ConnectionString}
                Dim sqlcommand As SqlCommand = New SqlCommand() With {.Connection = sqlconnection, .CommandText = ("SELECT  BranchOrders.SytemOrderNumber, BranchOrders.Type, BranchOrders.OrderReference, BranchOrders.PackageID,
                 IssueSubTypes.TypeName FROM            BranchOrders LEFT OUTER JOIN
                 IssueSubTypes ON BranchOrders.SubType = IssueSubTypes.SubTypeID WHERE        (BranchOrders.OrderID = @IssueId)")}
                sqlcommand.Parameters.Add(New SqlParameter("@IssueID", SqlDbType.UniqueIdentifier, 16, "IssueID")).Value = New Guid((IssueID.ToString))
                sqlconnection.Open()
                Dim dreader1 As SqlDataReader = sqlcommand.ExecuteReader(CommandBehavior.SingleRow)
                If dreader1.Read() Then
                    If dreader1(0) IsNot DBNull.Value Then Name(0) = (dreader1(0).ToString)
                    If dreader1(2) IsNot DBNull.Value Then Name(1) = Trim(dreader1(2).ToString)
                    If dreader1(1) IsNot DBNull.Value Then Type = (dreader1(1))
                    Select Case Type
                        Case 1
                            Name(2) = HttpContext.Current.Session("ArchiveNames")(14)
                        Case 2
                            Name(2) = HttpContext.Current.Session("ArchiveNames")(15)
                        Case 3
                            Name(2) = HttpContext.Current.Session("ArchiveNames")(16)
                        Case 4
                            Name(2) = HttpContext.Current.Session("ArchiveNames")(17)
                        Case 5
                            Name(2) = HttpContext.Current.Session("ArchiveNames")(18)
                        Case 6
                            Name(2) = HttpContext.Current.Session("ArchiveNames")(19)
                        Case 7
                            Name(2) = HttpContext.Current.Session("ArchiveNames")(20)
                        Case 8
                            Name(2) = HttpContext.Current.Session("ArchiveNames")(21)
                        Case 9
                            Name(2) = HttpContext.Current.Session("ArchiveNames")(22)
                        Case 10
                            Name(2) = HttpContext.Current.Session("ArchiveNames")(23)
                    End Select

                    If dreader1(3) IsNot DBNull.Value Then Name(4) = GetPackageName(dreader1(3).ToString)
                    If dreader1(4) IsNot DBNull.Value Then Name(3) = Trim(dreader1(4).ToString)

                Else
                    Name(0) = ""
                    Name(1) = ""
                    Name(2) = ""
                    Name(3) = ""
                    Name(4) = ""
                    Name(5) = ""
                End If
                sqlconnection.Close()
            End Using
        Else

        End If
        Using sqlconnection2 As SqlConnection = New SqlConnection() With {.ConnectionString = ConfigurationManager.ConnectionStrings("PVConnectionString").ConnectionString}
            Using sqlcommand2 As SqlCommand = New SqlCommand() With {.Connection = sqlconnection2, .CommandText = "SELECT DISTINCT UserView.FullName + N' - ' + UserView.CompanyName AS Detail 
            FROM BranchOrders LEFT OUTER JOIN  UserView ON BranchOrders.RecipientID = UserView.SystemUserID
            WHERE (BranchOrders.OrderID = @IssueId) OR (BranchOrders.ParentOrderID = @IssueId) ORDER BY Detail"}
                sqlcommand2.Parameters.Add(New SqlParameter("@IssueID", SqlDbType.UniqueIdentifier, 16, "IssueID")).Value = New Guid((IssueID.ToString))
                sqlconnection2.Open()
                Dim dreader2 As SqlDataReader = sqlcommand2.ExecuteReader
                Dim RecipientID
                Name(5) = ChrW(13) & ChrW(10)
                While dreader2.Read()
                    If dreader2(0) IsNot DBNull.Value Then Name(5) += dreader2(0).ToString & ChrW(13) & ChrW(10)
                End While
                sqlconnection2.Close()
            End Using
        End Using
        Return Name
    Catch ex As Exception
        log.ErrorLog(ex)
    End Try
End Function









Private Function GetIssueNumber(ByVal IssueID As String)
    Try
        Dim Name(2)
        If IssueID <> "" Then
            Using sqlconnection As SqlConnection = New SqlConnection() With {.ConnectionString = (DB.GetConString(Session("SystemClientID").ToString))}
                Dim sqlcommand As SqlCommand = New SqlCommand() With {.Connection = sqlconnection, .CommandText = 
                ("Select * From Issues Where (IssueID=@IssueID)")}
                sqlcommand.Parameters.Add(New SqlParameter("@IssueID", SqlDbType.UniqueIdentifier, 16, "IssueID")).Value = New Guid((IssueID.ToString))
                sqlconnection.Open()
                Dim dreader1 As SqlDataReader = sqlcommand.ExecuteReader(CommandBehavior.SingleRow)
                If dreader1.Read() Then
                    If dreader1("IssueNumber") IsNot DBNull.Value Then Name(0) = (dreader1("IssueNumber").ToString)
                    If dreader1("IssueType") IsNot DBNull.Value Then Name(1) = Trim(dreader1("IssueType").ToString)
                End If
                sqlconnection.Close()
            End Using
        Else
            Name(0) = ""
            Name(1) = ""
        End If
        Return Name
    Catch ex As Exception
        log.ErrorLog(ex)
    End Try
End Function


















Private Function GetMasterOrderNumber(ByVal ChildOrderID As String)
    Dim OrderNumber = ""
    Using sqlconnection As SqlConnection = New SqlConnection() With {.ConnectionString = ConfigurationManager.ConnectionStrings("PVConnectionString").ConnectionString}
        Dim sqlcommand As SqlCommand = New SqlCommand() With {.Connection = sqlconnection, .CommandText = ("SELECT  BranchOrders_1.SytemOrderNumber FROM BranchOrders LEFT OUTER JOIN BranchOrders AS BranchOrders_1 ON BranchOrders.ParentOrderID = BranchOrders_1.OrderID WHERE (BranchOrders.OrderID = @OrderID)")}
        sqlcommand.Parameters.Add(New SqlParameter("@OrderID", SqlDbType.UniqueIdentifier, 16, "OrderID")).Value = New Guid(ChildOrderID.ToString)
        sqlconnection.Open()
        Dim dreader1 As SqlDataReader = sqlcommand.ExecuteReader(CommandBehavior.SingleRow)
        If dreader1.Read() Then
            If dreader1(0) IsNot DBNull.Value Then OrderNumber = Trim(dreader1(0).ToString)
        End If
        sqlconnection.Close()
    End Using
    Return OrderNumber
End Function
Private Function GetBranchName(ByVal BranchID As Integer)
    Dim name = ""
    Using sqlconnection As SqlConnection = New SqlConnection() With {.ConnectionString = ConfigurationManager.ConnectionStrings("PVConnectionString").ConnectionString}
        Dim sqlcommand As SqlCommand = New SqlCommand() With {.Connection = sqlconnection, .CommandText = ("SELECT branch_name FROM branches WHERE (branch_id = @branch_id)")}
        sqlcommand.Parameters.Add(New SqlParameter("@branch_id", SqlDbType.Int, 4, "branch_id")).Value = BranchID
        sqlconnection.Open()
        Dim dreader1 As SqlDataReader = sqlcommand.ExecuteReader(CommandBehavior.SingleRow)
        If dreader1.Read() Then
            If dreader1(0) IsNot DBNull.Value Then name = Trim(dreader1(0).ToString)
        End If
        sqlconnection.Close()
    End Using
    Return name
End Function
Private Function GetName(ByVal UserID As String)
    Dim name = ""
    Using sqlconnection As SqlConnection = New SqlConnection() With {.ConnectionString = ConfigurationManager.ConnectionStrings("PVConnectionString").ConnectionString}
        Dim sqlcommand As SqlCommand = New SqlCommand() With {.Connection = sqlconnection, .CommandText = ("Select FullName From UserView Where (SystemUserID=@SystemUserID)")}
        sqlcommand.Parameters.Add(New SqlParameter("@SystemUserID", SqlDbType.UniqueIdentifier, 16, "SystemUserID")).Value = New Guid((UserID.ToString))
        sqlconnection.Open()
        Dim dreader1 As SqlDataReader = sqlcommand.ExecuteReader(CommandBehavior.SingleRow)
        If dreader1.Read() Then
            If dreader1(0) IsNot DBNull.Value Then name = Trim(dreader1(0).ToString)
        End If
        sqlconnection.Close()
    End Using
    If name = "" Then

        Using sqlconnection As SqlConnection = New SqlConnection
            sqlconnection.ConnectionString = (ConfigurationManager.ConnectionStrings("PVConnectionString").ConnectionString)
            Dim sqlcommand As SqlCommand = New SqlCommand()
            sqlcommand.Connection = sqlconnection
            sqlcommand.CommandText = ("Select * From UserView Where (SystemUserID=@SystemUserID)")
            sqlcommand.Parameters.Add(New SqlParameter("@SystemUserID", SqlDbType.UniqueIdentifier, 16, "SystemUserID")).Value = New Guid(UserID.ToString)
            sqlconnection.Open()
            Dim dreader1 As SqlDataReader = sqlcommand.ExecuteReader(CommandBehavior.SingleRow)
            If dreader1.Read() Then
                If dreader1("FullName") IsNot DBNull.Value Then name = Trim(dreader1("FullName"))
            End If
            sqlconnection.Close()
        End Using
    End If
    If name = "" Then
        Dim First = ""
        Dim Last = ""
        Using sqlconnection As SqlConnection = New SqlConnection
            sqlconnection.ConnectionString = (ConfigurationManager.ConnectionStrings("PVConnectionString").ConnectionString)
            Dim sqlcommand As SqlCommand = New SqlCommand()
            sqlcommand.Connection = sqlconnection
            sqlcommand.CommandText = ("Select * From Links Where (IntelinkID=@SystemUserID)")
            sqlcommand.Parameters.Add(New SqlParameter("@SystemUserID", SqlDbType.UniqueIdentifier, 16, "SystemUserID")).Value = New Guid(UserID.ToString)
            sqlconnection.Open()
            Dim dreader1 As SqlDataReader = sqlcommand.ExecuteReader(CommandBehavior.SingleRow)
            If dreader1.Read() Then
                If dreader1("iFirstName") IsNot DBNull.Value Then First = Trim(dreader1("iFirstName"))
                If dreader1("iLastName") IsNot DBNull.Value Then Last = Trim(dreader1("iLastName"))
            End If
            sqlconnection.Close()
            name = First & " " & Last
        End Using

    End If
    Return name
End Function
Private Function GetCompany(ByVal UserID As String)
    Dim name = ""
    Using sqlconnection As SqlConnection = New SqlConnection() With {.ConnectionString = ConfigurationManager.ConnectionStrings("PVConnectionString").ConnectionString}
        Dim sqlcommand As SqlCommand = New SqlCommand() With {.Connection = sqlconnection, .CommandText = ("Select CompanyName From UserView Where (SystemUserID=@SystemUserID)")}
        sqlcommand.Parameters.Add(New SqlParameter("@SystemUserID", SqlDbType.UniqueIdentifier, 16, "SystemUserID")).Value = New Guid((UserID.ToString))
        sqlconnection.Open()
        Dim dreader1 As SqlDataReader = sqlcommand.ExecuteReader(CommandBehavior.SingleRow)
        If dreader1.Read() Then
            If dreader1(0) IsNot DBNull.Value Then name = Trim(dreader1(0).ToString)
        End If
        sqlconnection.Close()
    End Using
    If name = "" Then
        Using sqlconnection As SqlConnection = New SqlConnection
            sqlconnection.ConnectionString = (ConfigurationManager.ConnectionStrings("PVConnectionString").ConnectionString)
            Dim sqlcommand As SqlCommand = New SqlCommand()
            sqlcommand.Connection = sqlconnection
            sqlcommand.CommandText = ("Select * From UserView Where (SystemUserID=@SystemUserID)")
            sqlcommand.Parameters.Add(New SqlParameter("@SystemUserID", SqlDbType.UniqueIdentifier, 16, "SystemUserID")).Value = New Guid(UserID.ToString)
            sqlconnection.Open()
            Dim dreader1 As SqlDataReader = sqlcommand.ExecuteReader(CommandBehavior.SingleRow)
            If dreader1.Read() Then
                If dreader1("CompanyName") IsNot DBNull.Value Then name = Trim(dreader1("CompanyName"))
            End If
            sqlconnection.Close()
        End Using
    End If
    If name = "" Then
        Using sqlconnection As SqlConnection = New SqlConnection
            sqlconnection.ConnectionString = (ConfigurationManager.ConnectionStrings("PVConnectionString").ConnectionString)
            Dim sqlcommand As SqlCommand = New SqlCommand()
            sqlcommand.Connection = sqlconnection
            sqlcommand.CommandText = ("Select * From Links Where (IntelinkID=@SystemUserID)")
            sqlcommand.Parameters.Add(New SqlParameter("@SystemUserID", SqlDbType.UniqueIdentifier, 16, "SystemUserID")).Value = New Guid(UserID.ToString)
            sqlconnection.Open()
            Dim dreader1 As SqlDataReader = sqlcommand.ExecuteReader(CommandBehavior.SingleRow)
            If dreader1.Read() Then
                If dreader1("iCompanyName") IsNot DBNull.Value Then name = Trim(dreader1("iCompanyName"))
            End If
            sqlconnection.Close()
        End Using
    End If
    Return name
End Function
Private Function GetAction(ByVal ActionID As String)
    Dim name = ""
    Using sqlconnection As SqlConnection = New SqlConnection() With {.ConnectionString = ConfigurationManager.ConnectionStrings("PVConnectionString").ConnectionString}
        Dim sqlcommand As SqlCommand = New SqlCommand() With {.Connection = sqlconnection, .CommandText = ("Select EnglishStd From AuditCodes Where (ActionID=@ActionID)")}
        sqlcommand.Parameters.Add(New SqlParameter("@ActionID", SqlDbType.Int, 4, "ActionID")).Value = ActionID
        sqlconnection.Open()
        Dim dreader1 As SqlDataReader = sqlcommand.ExecuteReader(CommandBehavior.SingleRow)
        If dreader1.Read() Then
            If dreader1(0) IsNot DBNull.Value Then name = Trim(dreader1(0).ToString)
        End If
        sqlconnection.Close()
    End Using
    Return name
End Function

End Class
End Class
