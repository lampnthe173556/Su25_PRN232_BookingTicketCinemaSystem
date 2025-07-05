﻿using System.Security.Cryptography;
using System.Text;

namespace ProjectHouseWithLeaves.Helper.PasswordHasing
{
    public class PasswordHassing
    {
        public static string ComputeSha256Hash(string rawData)
        {
            
            using (SHA256 sha256Hash = SHA256.Create())
            {
                
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

                
                StringBuilder builder = new StringBuilder();
                foreach (byte b in bytes)
                {
                    builder.Append(b.ToString("x2")); 
                }
                return builder.ToString();
            }
        }
    }
}
