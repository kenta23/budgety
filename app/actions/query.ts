'use server';

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";
import { headers } from "next/headers";

const incomeSchema = z.object({ 
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    source: z.string().min(1, "Please select an income source"),
    frequency: z.string().min(1, "Please select a frequency"),
    income_name: z.string().min(1, "Income name is required"),
})


type incomeData = z.infer<typeof incomeSchema>;


export async function submitNewIncome(previousState: any, formData: FormData) { 
    const session = await auth.api.getSession({ 
         headers: await headers(),
    });

    if (!session?.user) { 
         return { 
             error: "Unauthorized",
             message: "Unauthorized",
         }
     }

  try {
    const data = Object.fromEntries(formData.entries());
    const parsedData = incomeSchema.safeParse(data);

    // console.log("parsedData", parsedData);
    console.log('data', data);

    console.log('parsedData', parsedData);

    if (!parsedData.success) { 
        console.log('parsedData.error', parsedData.error);
         return { 
             error: parsedData.error?.message,
             message: "Failed to submit new income",
         }
    }

    else { 
         const newIncomeData = await prisma.income.create({ 
             data: { 
                 amount: parsedData.data.amount,
                 source: parsedData.data.source,
                 frequency: parsedData.data.frequency,
                 income_name: parsedData.data.income_name,
                 userId: session.user.id,
             },       
         })

         console.log('NEW INCOME STORED IN DATABASE', newIncomeData);

         revalidatePath('/income');

         return { 
             error: null,
             message: "New income submitted successfully",
         }

    }

  } catch (error) {
    console.error("Error submitting new income", error);
    return {
        error: "Failed to submit new income",
        message: "Failed to submit new income",
    };
  }
  
} 