// components/PersistenceDemo.tsx
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks/store";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/buttons/Button";
import { Input } from "@/components/input/Inputs";
import { logout, setCredentials } from "@/store/slices/auth.slice";

 
