package com.example.littlelemon

import android.widget.Toast
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun UpperPanel() {

    val context = LocalContext.current

    Column (
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.Start,
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0XFF495E57))
    ){
        Text(
            text = "little Lemon",
            fontSize = 32.sp,
            color = Color(0xFFF4CE14),
            modifier = Modifier.padding(start = 20.dp, top = 20.dp)
        )
        Text(
            text = stringResource(id = R.string.chicago),
            fontSize = 32.sp,
            color = Color(0xFFF4CE14),
            modifier = Modifier.padding(start = 20.dp)
        )
        Row (
            Modifier.padding(20.dp),
            horizontalArrangement = Arrangement.Center,
        ) {
            Text(
                text = stringResource(id = R.string.description_one),
                fontSize = 21.sp,
                color = Color.White,
                modifier = Modifier.width(200.dp)
            )
            Image(
                painter = painterResource(id = R.drawable.test),
                contentDescription = "",
                Modifier.height((200.dp)).clip(RoundedCornerShape(20.dp)),
            )
        }
        Button(
            onClick = {
                println("this is a test")
                Toast.makeText(context, "Order Successful!", Toast.LENGTH_SHORT).show()
            },
            border = BorderStroke(1.dp, Color.Red),
            shape = RoundedCornerShape(10.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color(0XFFF4CE14)
            )
        ) {
            Text(text = stringResource(id = R.string.order))
        }
    }
}